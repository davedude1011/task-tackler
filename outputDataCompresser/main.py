import json
import re

def removeBracketedContent(input_string):
    output = []
    inside_brackets = False
    
    for char in input_string:
        if char == '<':
            inside_brackets = True
        elif char == '>':
            inside_brackets = False
        elif not inside_brackets:
            output.append(char)
    
    return ''.join(output).replace("&ZeroWidthSpace;", "")

def removeAttributesExceptSrc(input_string):
    # Define a regex pattern to match any attribute except 'src'
    pattern = r'\b(?!src\b)[a-zA-Z-]+\s*=\s*"(.*?)"'
    
    # Use re.sub to remove these attributes from the input string
    output = re.sub(pattern, '', input_string)
    
    # Clean up any remaining unwanted characters or extra spaces
    output = re.sub(r'\s{2,}', ' ', output).strip()
    
    return output

with open("./outputData.json", "r") as inputDataRaw:
    inputData = json.load(inputDataRaw)
    compressedData = []

    for dataBlock in inputData:
        dataBlock["question"] = removeBracketedContent(dataBlock["question"])
        dataBlock["answer"] = removeAttributesExceptSrc(dataBlock["answer"])
        if ("Want a more accurate answer?" not in dataBlock["answer"] and "gpt-mask" not in dataBlock["answer"]):
            compressedData.append(dataBlock)

    with open("./outputDataCompresser/compressedData.json", "w") as compressedDataRaw:
        json.dump(compressedData, compressedDataRaw, indent=4)