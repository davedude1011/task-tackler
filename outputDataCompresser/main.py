import json
from bs4 import BeautifulSoup

def removeKatexHtmlElements(input_html):
    soup = BeautifulSoup(input_html, "lxml")
    # Remove all elements with the class 'katex-html'
    for element in soup.select(".katex-html"):
        element.decompose()
    return str(soup)

def removeAttributesExceptSrc(input_html):
    soup = BeautifulSoup(input_html, "lxml")
    for tag in soup.find_all(True):
        # List all attributes that are not 'src'
        attrs = {key: value for key, value in tag.attrs.items() if key != 'src'}
        for attr in attrs:
            del tag[attr]
    return str(soup)

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

def process_data(input_data):
    compressedData = []
    for dataBlock in input_data:
        # Assuming the question field does not require HTML manipulation
        dataBlock["question"] = removeBracketedContent(dataBlock["question"])
        # Apply HTML removal to the answer field
        dataBlock["answer"] = removeKatexHtmlElements(dataBlock["answer"])
        dataBlock["answer"] = removeAttributesExceptSrc(dataBlock["answer"])
        if ("Want a more accurate answer?" not in dataBlock["answer"] and "gpt-mask" not in dataBlock["answer"]):
            compressedData.append(dataBlock)
    return compressedData
    

# Example of reading and writing data
with open("./outputData.json", "r") as inputDataRaw:
    inputData = json.load(inputDataRaw)
    compressedData = process_data(inputData)
    with open("./compressedData.json", "w") as compressedDataRaw:
        json.dump(compressedData, compressedDataRaw, indent=4)
