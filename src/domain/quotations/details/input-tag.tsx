import clsx from "clsx";
import React, { useCallback, useState } from "react";

type Props = {
  maxLength?: number;
  value?: string[];
  onSubmit?: (value: string[]) => void;
  readOnly?: boolean;
  placeholder?: string;
};

const InputTag = ({
  value,
  maxLength,
  onSubmit,
  readOnly,
  placeholder,
}: Props) => {
  const [arrValue, setArrValue] = useState<string[]>(value || []);
  const [string, setString] = useState<string>("");

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setString(event.target.value);
    },
    []
  );

  const handleSubmitAddTag = useCallback(() => {
    if (arrValue.length === maxLength) return;
    if (!string) return;

    const isDuplicate = string && !!arrValue.find((str) => str === string);
    if (isDuplicate) return;
    const cloneArr = [...arrValue];
    cloneArr.push(string);

    setArrValue([...cloneArr]);
    onSubmit && onSubmit(cloneArr);
    setString("");
  }, [arrValue, maxLength, onSubmit, string]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        handleSubmitAddTag();
      }
    },
    [handleSubmitAddTag]
  );

  const handleBlur = useCallback(() => {
    if (readOnly) return;
    handleSubmitAddTag();
  }, [handleSubmitAddTag, readOnly]);

  const handleDeleteTag = useCallback(
    (index: number) => {
      const cloneArr = [...arrValue];
      cloneArr.splice(index, 1);
      setArrValue([...cloneArr]);
      onSubmit && onSubmit(cloneArr);
    },
    [arrValue, onSubmit]
  );

  return (
    <div
      className={clsx(
        "border px-2 py-1 rounded-lg w-full",
        "focus-within:shadow-input focus-within:border-violet-60 focus-within:bg-grey-5",
        "flex flex-row h-10 max-h-full overflow-x-auto scrollbar-none justify-end"
      )}
    >
      {arrValue.map((str, index) => (
        <span
          key={index}
          className={clsx(
            "bg-green-500/50 p-1 text-sm mr-1 rounded w-fit",
            "whitespace-nowrap flex items-center gap-2"
          )}
        >
          {str}
          {!readOnly && (
            <span
              className="cursor-pointer"
              onClick={() => handleDeleteTag(index)}
            >
              x
            </span>
          )}
        </span>
      ))}
      <input
        readOnly={readOnly}
        placeholder={(!readOnly && placeholder) || ""}
        className={clsx(
          "outline-none focus-within:outline-none text-sm w-full min-w-[300px] relative right-0"
        )}
        maxLength={100}
        value={string}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        type="text"
      />
    </div>
  );
};

export default InputTag;
