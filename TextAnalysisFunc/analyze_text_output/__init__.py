import logging
import json
import os
from typing import Dict, Optional

from azure.core.exceptions import HttpResponseError
from azure.data.tables import TableClient, TableEntity
from azure.data.tables._models import UpdateMode
import azure.functions as func
from numpy import partition

TABLE_NAME = "WebPages"
TABLE_STORAGE_CONNECTION_STRING_ENV_VAR = "TableStorageConnectionString"

def main(document: str):
    logging.info(f"Running analyze_text_output function.")

    connection_string = os.getenv(TABLE_STORAGE_CONNECTION_STRING_ENV_VAR)
    if connection_string is not None:
        logging.info("Parsing updated text")
        data: Dict[str, str] = json.loads(document)

        client: TableClient = TableClient.from_connection_string(
            connection_string,
            table_name=TABLE_NAME,
            logging_enable=True,
        )
        entity: Optional[TableEntity] = None
    
        logging.info("Querying entity")
        try:
            partition_key = data["PartitionKey"]
            row_key = data["RowKey"]
            # The row key is sometimes having malformed data
            # This replace helps with that
            row_key = row_key.replace("%20", " ")
            logging.info(f"Fetching item with PartitionKey: {partition_key} and RowKey: {row_key}")
            entity = client.get_entity(partition_key=partition_key, row_key=row_key)
            entity["Summary"] = data["summary"]
            entity["Predicted"] = data["predicted"]
        except HttpResponseError:
            logging.exception("Unable to query entity")
            raise

        logging.info(f"Updating entity with PartitionKey: {partition_key} and RowKey: {row_key}")
        try:
            client.upsert_entity(entity=entity, mode=UpdateMode.MERGE)
            logging.info(f"Successfully updated entity with PartitionKey: {partition_key} and RowKey: {row_key}")
        except HttpResponseError:
            logging.exception("Unable to update entity")
            raise

    else:
        error_message = f"Connection string '{TABLE_STORAGE_CONNECTION_STRING_ENV_VAR}' was not set or does not contain a value."
        logging.error(error_message)
        raise Exception(error_message)

    return "Success"
