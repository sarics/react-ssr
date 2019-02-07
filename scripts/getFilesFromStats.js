const createGetChunkFiles = publicPath => chunk =>
  chunk.files
    .filter(file => !/\.hot-update\.js$/.test(file))
    .reduce(
      ({ css, js }, file) => ({
        css: /\.css$/.test(file) ? css.concat(publicPath + file) : css,
        js: /\.js$/.test(file) ? js.concat(publicPath + file) : js,
      }),
      { css: [], js: [] },
    );

module.exports = ({ publicPath, chunks }) => {
  const getChunkFiles = createGetChunkFiles(publicPath);

  const initialFiles = chunks
    .filter(({ initial }) => initial)
    .sort((aChunk, bChunk) => {
      if (aChunk.entry) return -1;
      if (bChunk.entry) return 1;

      return 0;
    })
    .reduce(
      ({ css, js }, chunk) => {
        const chunkFiles = getChunkFiles(chunk);

        return {
          css: css.concat(chunkFiles.css),
          js: js.concat(chunkFiles.js),
        };
      },
      { css: [], js: [] },
    );

  const asyncFilesByRequest = chunks
    .filter(({ initial }) => !initial)
    .reduce((acbr, chunk) => {
      const chunkFiles = getChunkFiles(chunk);

      return chunk.origins
        .map(({ request }) => request)
        .filter(Boolean)
        .reduce((newAcbr, request) => {
          const { css, js } = newAcbr[request] || { css: [], js: [] };

          return {
            ...newAcbr,
            [request]: {
              css: css.concat(chunkFiles.css),
              js: js.concat(chunkFiles.js),
            },
          };
        }, acbr);
    }, {});

  return {
    initial: initialFiles,
    asyncByRequest: asyncFilesByRequest,
  };
};
