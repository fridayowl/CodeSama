class DataProcessor:
    print("hello")
    def __init__(self, data):
        self.data = data
        self.processed_data = None

    def clean_data(self):
        """Remove any null or empty values from the data."""
        self.data = [item for item in self.data if item]
        return self

    def sort_data(self, reverse=False):
        """Sort the data in ascending or descending order."""
        self.data.sort(reverse=reverse)
        return self
    print("abc")
    def process(self):
        """Apply all data processing steps."""
        self.processed_data = (
            self.clean_data()
            .sort_data()
            .data
        )
        return self.processed_data

print("test")
print("test1")