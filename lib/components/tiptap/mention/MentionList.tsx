import { Button, Stack, Typography } from "@mui/material";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export default forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: any }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="flex flex-row border border-slate-300 rounded bg-white w-fit shadow-variant-1">
      <Stack
        borderRight="2px solid rgb(203 213 225)"
        direction="column"
        justifyContent="left"
        alignItems={"flex-start"}
      >
        {props.items.length ? (
          props.items.slice(0, 10).map((item: any, index: number) => (
            <Button
              variant="text"
              disableRipple
              sx={{
                textTransform: "none",
                color: "#212B36",
                background: index === selectedIndex ? "#DFE1E4" : "",
                width: "100%",
                justifyContent: "left",
                alignItems: "flex-start",
              }}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.label}
            </Button>
          ))
        ) : (
          <Typography
            className="flex flex-row gap-x-2.5 items-center py-1.5 px-3 hover:bg-new-white-2 cursor-pointer outline-none"
            sx={{ textTransform: "none", color: "#212B36" }}
          >
            No result
          </Typography>
        )}
      </Stack>
    </div>
  );
});
