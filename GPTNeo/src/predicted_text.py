from dataclasses import dataclass
from datetime import datetime
from typing import Dict

@dataclass
class PredictedText:
    """Class for keeping track of an entity that contains predicted text."""
    input_text: str
    predicted_text: str
    partition_key: str
    id: str
    timestamp: datetime

    def as_dict(self) -> Dict:
        return {
            "PartitionKey": self.partition_key,
            "RowKey": self.id,
            "PredictedText": self.predicted_text,
            "InputText": self.input_text,
            "Timestamp": self.timestamp.__str__()
        }

    def __str__(self):
        return self.as_dict().__str__()