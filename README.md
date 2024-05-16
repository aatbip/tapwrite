<h1 align="center">Tapwrite</h1>
<p align="center">
<img width="100px" src="./tapwrite-logo.png" alt="Tapwrite">
</p>
<p align="center">
Enhance your web applications with `Tapwrite`, a robust WYSIWYG rich text editor component for React built on top of Tiptap designed to integrate seamlessly into your projects. This component supports image and PDF file handling within the text editor environment, Table, and Slash command menu, simplifying content management for users and developers alike. 
</p>

### Description
Building text editors for browsers from scratch is challenging, with few options for seamless integration into browser-based applications. Headless technologies like Tiptap offer customization but demand time and effort. Tapwrite is a lightweight, effortless solution for developers, providing a seamless rich text editing experience with zero configuration needed. Easily incorporate features like image and PDF uploading directly within the editor environment.

![Tapwrite](./tapwrite.png)

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
    // 'file' is the selected image or PDF.

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

### Future Enhancements

We have plans on enhancing Tapwrite in the future versions. The immediate requirements are:

- Support for links 
- Support for iframe
- Add ability to style the editor, slash command menu, and bubble menu. 
- Ability to extend the Titap editor plugins to include custom features
- Ability to add further commands in the slash command menu/bubble menu

### Philosophy

We strive for Tapwrite to seamlessly integrate with your app without extensive configuration requirements. However, we also value its potential for extension, such as the ability to customize Tiptap editor plugins to include custom features, which is part of our future enhancements plan. Our aim is for Tapwrite to operate with zero configuration while offering simple, minimal configuration options for customizing and enhancing its core behavior. We actively encourage contributors to uphold this philosophy when working on feature enhancements.