import React from "react";
import CircularProgressbar from "react-circular-progressbar";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";
import { Container, FileInfo, Preview } from "./styles";

const truncate = (string, length) => {
  const truncatedString = `${string.substr(0, length - 3)}...`;

  return (string.length > truncatedString.length && truncatedString) || string;
};

const FileList = ({ files, onDelete }) => (
  <Container>
    {files.map(
      ({ id, name, readableSize, preview, progress, uploaded, error, url }) => (
        <li key={id}>
          <FileInfo>
            <Preview src={preview} />
            <div>
              <strong>{truncate(name, 28)}</strong>
              <span>
                {readableSize.human()}{" "}
                {!!url && (
                  <button onClick={() => onDelete(id)}> Excluir</button>
                )}
              </span>
            </div>
          </FileInfo>
          <div>
            {!uploaded && !error && (
              <CircularProgressbar
                styles={{
                  root: { width: 24 },
                  path: { stroke: "#7159c1" }
                }}
                strokeWidth={10}
                percentage={progress}
              />
            )}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}
            {uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
            {error && <MdError size={24} color="#e57878" />}
          </div>
        </li>
      )
    )}
  </Container>
);

export default FileList;
