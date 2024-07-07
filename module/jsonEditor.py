from typing import Any
import json 

# 固定路徑
pointsJsonPath = './points/points.json'

"""
讀寫JSON檔案
"""

# 讀取json file
def readJsonFile(filePath) -> Any:
    try:
        with open(filePath, "r", encoding="utf-8") as jsonFile:
            data = json.loads(jsonFile.read())
        return data
    
    except Exception as e:
        print(e)
        return False

# 覆寫json file
def updateJsonFile(filePath, newData) -> Any:
    try:
        jsonString = json.dumps(newData, indent=2)
        with open(filePath, "w", encoding="utf-8") as jsonFile:
            jsonFile.write(jsonString)
        return True
    
    except Exception as e:
        print(e)
        return False