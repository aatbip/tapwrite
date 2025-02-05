<h1 align="center">Tapwrite</h1>
<p align="center">
![image](https://github.com/user-attachments/assets/3993c0c7-29eb-4164-a6df-7cebc4c20963)
</p>
<p align="center">
Enhance your web applications with `Tapwrite`, a robust WYSIWYG rich text editor component for React built on top of Tiptap designed to integrate seamlessly into your projects. This component supports image and PDF file handling within the text editor environment, Table, and Slash command menu, simplifying content management for users and developers alike. 
</p>

### Description
Building text editors for browsers from scratch is challenging, with few options for seamless integration into browser-based applications. Headless technologies like Tiptap offer customization but demand time and effort. Tapwrite is a lightweight, effortless solution for developers, providing a seamless rich text editing experience with zero configuration needed. Easily incorporate features like image and file uploads directly within the editor environment.

![tapwrite](https://github-production-user-asset-6210df.s3.amazonaws.com/38468429/331266752-59539467-32a6-4df0-bf70-e13a8c04c0f3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240516%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240516T160401Z&X-Amz-Expires=300&X-Amz-Signature=b54903d1e25dfcbf914349f6f7366224c7531bac4e61de1f63d1a8fe61fa85ad&X-Amz-SignedHeaders=host&actor_id=38468429&key_id=0&repo_id=798623870)


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
    // 'file' is the selected image or attachments of type File. The uploadFn should return a url for src of the file. 
  }}
  content=""  // Pass the initial content to be rendered in the editor.
  getContent={(content) => console.log(content)}  // Function to output the current content of the editor.
  deleteEditorAttachments = {async(id) => { }}  // Function to invoke after deleting attachments/Images from the editor.
  editorClass={editorClass} // custom classname for Editor.
  hardbreak={false} // applies hardbreak on the editor.
  attachmentLayout={attachmentLayout} // custom React node for attachments.
/>
```

### Demo

[View Demo](https://github.com/pagevamp/tapwrite/assets/38468429/e2f6b2d4-8746-459d-a279-015a07cffdea)


## Testing Locally

- Clone the `Tapwrite` repository and apply your changes.
- Run `npm run build` to transpile your changes.
- Run `npm pack` which creates a `.tgz`(tarball) file of the build. It essentially bundles your package just like npm publish but without actually publishing it.
  
   ![image](https://github.com/user-attachments/assets/9dcb0063-8867-44d3-85b2-b789d1582a49)
  
- In your `package.json`, replace the value of tapwrite in dependencies with the path of your `.tgz` file.
  
   ![image](https://github.com/user-attachments/assets/e45d483b-6556-42de-a561-84bc15ec86e5)

- Run `npm install`
- To revert the changes and use the published version, simply run `npm i tapwrite`
   



## Contributions

Contributions are vital for the continuous improvement of `Tapwrite`. If you're interested in contributing, please feel free to submit pull requests or share your ideas and feedback through issues on our GitHub repository.


## Contribution Guidelines

### Coding Standards 

- [x] Linting: Use ESLint and Prettier to maintain code consistency.
- [x] TypeScript: Ensure all contributions are typed.
- [x] Documentation: Update relevant documentation (e.g., README, inline comments) for new features.
- [x] Commit Messages: Follow Conventional Commits.

### Submitting Pull Requests 

- Use descriptive branch names.
- Pull Request Template :
    - Describe changes and motivation.
    - Reference related issues if there are any.
    - Attach screenshots/videos for testing and UI changes.
- Be responsive to feedback.

### Reporting issues 

- Use the [GitHub Issues](https://github.com/pagevamp/tapwrite/issues) template.
- Please describe :
     - Steps to Reproduce in detail.
     - Expected vs. Actual Behavior comparison.
     - Screenshots/Logs.
     - Environment.


## Future Enhancements

We have plans on enhancing Tapwrite in the future versions. The immediate requirements are:

- Support for links 
- Support for iframe
- Add ability to style the editor, slash command menu, and bubble menu. 
- Ability to extend the Titap editor plugins to include custom features
- Ability to add further commands in the slash command menu/bubble menu

## Philosophy

We strive for Tapwrite to seamlessly integrate with your app without extensive configuration requirements. However, we also value its potential for extension, such as the ability to customize Tiptap editor plugins to include custom features, which is part of our future enhancements plan. Our aim is for Tapwrite to operate with zero configuration while offering simple, minimal configuration options for customizing and enhancing its core behavior. We actively encourage contributors to uphold this philosophy when working on feature enhancements.
