const getFilesFromChunk = ({ id, files }) =>
  files.map(file => {
    const [ext] = file.match(/\.[^.]+(\.map)?$/) || [''];
    const name = id + ext;
    return { name, file };
  });

const getFilesFromStats = stats =>
  Object.entries(stats.assetsByChunkName).reduce(
    (f, [id, files]) =>
      f.concat(
        getFilesFromChunk({
          id,
          files: Array.isArray(files) ? files : [files],
        }),
      ),
    [],
  );

const buildManifest = (files, publicPath) =>
  files.reduce(
    (manifest, { name, file }) =>
      Object.assign({}, manifest, { [name]: publicPath + file }),
    {},
  );

module.exports = {
  getFilesFromStats,
  buildManifest,
};
