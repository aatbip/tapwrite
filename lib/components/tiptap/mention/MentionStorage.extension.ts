import { Extension } from "@tiptap/core";

export const MentionStorage = Extension.create({
  name: "MentionStorage",
  addStorage() {
    return {
      suggestions: [],
    };
  },
});
