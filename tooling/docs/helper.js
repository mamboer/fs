exports.escapedAnchor = function (anchor) {
  if (typeof anchor !== 'string') return null;
  return anchor.replace(/\./g, '_').replace(/\+/g, '__');
}
