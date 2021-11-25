from azure.data.tables.aio import TableServiceClient
from azure.data.tables import UpdateMode
import logging
import sys, os

from predicted_text import PredictedText

# Configure the logger, as described here
# https://docs.microsoft.com/en-us/python/api/overview/azure/data-tables-readme?view=azure-python#logging
# logger = logging.getLogger('azure')
# handler = logging.StreamHandler(stream=sys.stdout)
# logger.addHandler(handler)

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

TABLE_STORAGE_CONNECTION_STRING_ENV_VAR = "TABLE_STORAGE_CONNECTION_STRING"

# sample async functions for table storage client here
# https://github.com/Azure/azure-sdk-for-python/blob/azure-data-tables_12.1.0/sdk/tables/azure-data-tables/samples/async_samples/sample_update_upsert_merge_entities_async.py
class TableStorageClient():
    def __init__(self, table_name: str):
        logging.info("Reading connection string from environment variable")
        connection_string = os.getenv(TABLE_STORAGE_CONNECTION_STRING_ENV_VAR)
        logging.info(f"Read connection string from environment variable. Length: {len(connection_string)}")

        logging.info(f"Connecting to table storage account")
        self.table_service_client = TableServiceClient.from_connection_string(conn_str=connection_string, logging_enable=True)
        logging.info(f"Connected to table storage account")
        logging.info(f"Connecting to table {table_name}")
        self.predicted_text_client = self.table_service_client.get_table_client(table_name)
        logging.info(f"Connected to table {table_name}")

    async def get_entity_async(self, partition_key: str, id: str) -> PredictedText:
        async with self.predicted_text_client:
            try:
                logging.info(f"Getting entity with partition key '{partition_key}' and row key '{id}'")
                got_entity = await self.predicted_text_client.get_entity(partition_key=partition_key, row_key=id)
                logging.info(f"Got entity: {got_entity}")
                return got_entity
            except:
                logging.exception("Failed to get entity")
                raise
                

    async def upsert_entity_async(self, entity: PredictedText) -> PredictedText:
        async with self.predicted_text_client:
            try:
                logging.info(f"Upserting entity: {entity}")
                upserted_entity = await self.predicted_text_client.upsert_entity(mode=UpdateMode.REPLACE, entity=entity.as_dict())
                logging.info(f"Upserted entity: {upserted_entity}")
                return upserted_entity
            except:
                logging.exception("Failed up upsert entity")
                raise
