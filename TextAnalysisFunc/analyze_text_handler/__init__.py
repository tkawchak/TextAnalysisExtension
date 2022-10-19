import logging
import json
import azure.functions as func
import azure.durable_functions as df

async def main(msg: func.ServiceBusMessage, starter: str):
    logging.info("starting analyze_text_handler")
    
    message_body = msg.get_body().decode('utf-8')
    logging.debug(f"message body: {message_body}")

    message_details = json.dumps({
        'message_id': msg.message_id,   
        'body': msg.get_body().decode('utf-8'),
        'content_type': msg.content_type,
        # 'expiration_time': msg.expiration_time,
        'label': msg.label,
        'partition_key': msg.partition_key,
        'reply_to': msg.reply_to,
        'reply_to_session_id': msg.reply_to_session_id,
        # 'scheduled_enqueue_time': msg.scheduled_enqueue_time,
        'session_id': msg.session_id,
        'time_to_live': msg.time_to_live,
        'to': msg.to,
        'user_properties': msg.user_properties,
        'metadata' : msg.metadata,
    })
    logging.debug(message_details)

    # State the orchestration function
    logging.info("starting analyze_text_orchestration")
    client = df.DurableOrchestrationClient(starter)
    instance_id = await client.start_new("analyze_text_orchestration", client_input=message_body)
    logging.info(f"started orchestration with instance id: {instance_id}")

    # How to manage an orchestration instance
    # https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-instance-management?tabs=python