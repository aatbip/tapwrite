## A powerful text editor component

### Demo

[Tapwrite-demo.webm](https://github.com/pagevamp/tapwrite/assets/38468429/e2f6b2d4-8746-459d-a279-015a07cffdea)

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
