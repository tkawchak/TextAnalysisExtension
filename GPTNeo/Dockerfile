# other python images: https://hub.docker.com/_/python/
FROM python:3.8-slim

WORKDIR /usr/app
RUN pip install --upgrade pip
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./src ./src

CMD ["./src/predict_text.py"]
ENTRYPOINT ["python"]

# TODO
# Mount the azure file share as volume, as described here:
# https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files#deploy-container-and-mount-volume---resource-manager

# TODO
# For the output of the Container instance, data should be written to table storage.
# Once the output data is written to table storage, we can listen for that from an azure function, which can then update the entry for that website.
# Or, if the predict isn't called from Azure functions, this output can be queries from the caller, assuming they have access
# to the table storage location
