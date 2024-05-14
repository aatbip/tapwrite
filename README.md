## Tapwrite: A Powerful Text Editor Component

Enhance your web applications with `Tapwrite`, a robust text editor component designed to integrate seamlessly into your projects. This component supports image and PDF file handling within the text editor environment, simplifying content management for users and developers alike.

 ### Demo

[View Demo](https://github.com/pagevamp/tapwrite/assets/38468429/e2f6b2d4-8746-459d-a279-015a07cffdea)

### Installation

Install `Tapwrite` with npm by running the following command:

```bash
npm i tapwrite
```

### Usage

Here’s how to implement `Tapwrite` in your project:

```javascript
import { Tapwrite, ImagePickerUtils } from 'tapwrite';

<Tapwrite
  // Function triggered after a file is selected. Parameter uploadFn is optional.
  uploadFn={async (file, tiptapEditorUtils) => {
    // 'file' is the selected image or PDF. Support for image and PDF files is available as of v1.0.0.

    // Utilize setImage or insertPdf methods from tiptapEditorUtils to render the file on the editor.
    tiptapEditorUtils.setImage(url || "");
  }}
  // Pass the initial content to be rendered in the editor.
  content=""
  // Function to output the current content of the editor.
  getContent={(content) => console.log(content)}
/>
```

### Contributions

Contributions are vital for the continuous improvement of `Tapwrite`. If you're interested in contributing, please feel free to submit pull requests or share your ideas and feedback through issues on our GitHub repository.
