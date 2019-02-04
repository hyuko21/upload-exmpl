import React, { Component } from "react";
import uniqueId from "lodash/uniqueId";
import filesize from "file-size";

import api from "./services/api";

import GlobalStyle from "./styles/global";
import { Container, Content } from "./styles";

import Upload from "./components/Upload";
import FileList from "./components/FileList";

class App extends Component {
  state = {
    uploadedFiles: []
  };

  async componentDidMount() {
    const { data: files } = await api.get("posts");

    this.setState({
      uploadedFiles: files.map(({ _id, name, size, url }) => ({
        id: _id,
        name,
        readableSize: filesize(size),
        preview: url,
        uploaded: true,
        url
      }))
    });
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });

    uploadedFiles.forEach(this.processUpload);
  };

  updateFile = (id, data) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile;
      })
    });
  };

  processUpload = async ({ id, file, name }) => {
    const data = new FormData();

    data.append("file", file, name);

    try {
      const { data: file } = await api.post("posts", data, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));

          this.updateFile(id, { progress });
        }
      });

      this.updateFile(id, {
        uploaded: true,
        id: file._id,
        url: file.url
      });
    } catch (err) {
      this.updateFile(id, {
        error: true
      });
    }
  };

  handleDelete = async id => {
    await api.delete(`posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    });
  };

  componentWillMount() {
    this.state.uploadedFiles.forEach(({ preview }) =>
      URL.revokeObjectURL(preview)
    );
  }

  render() {
    const { uploadedFiles } = this.state;

    return (
      <Container>
        <Content>
          <Upload onUpload={this.handleUpload} />
          {!!uploadedFiles.length && (
            <FileList files={uploadedFiles} onDelete={this.handleDelete} />
          )}
        </Content>
        <GlobalStyle />
      </Container>
    );
  }
}

export default App;
