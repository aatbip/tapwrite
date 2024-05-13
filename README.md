## A powerful text editor component

### Demo

[Tapwrite-demo.webm](https://github.com/pagevamp/tapwrite/assets/38468429/1e6f78b2-1496-4263-b77a-0868fe7d4a8a)

### Installation

```
npm i tapwrite
```

### Usage

```javascript
import { Tapwrite, ImagePickerUtils } from 'tapwrite'

<Tapwrite
  //function that is triggered after file is selected
  uploadFn={async (file, tiptapEditorUtils) => {
    //file is the selected image/pdf. Only image/pdf file are supported as of v1.0.0

    //then use setImage or insertPdf methods from tiptapEditorUtils to render on the editor
    tiptapEditorUtils.setImage(url || "");
  }}
  //pass the content value that should render
  content=""
  //returns the content 
  getContent={(content) => console.log(content)}
/>
```

### Contributions
We welcome anyone who wants to contribute to this project. 
