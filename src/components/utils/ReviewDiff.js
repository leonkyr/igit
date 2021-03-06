import React, { useState } from 'react';
import diffParser from 'gitdiff-parser';
import PropTypes from 'prop-types';

const HUNK_LINE_HEIGHT = 23;

function ensureDiffHeaderExists(diff, path) {
  let diffStr = diff;

  if (path && !diff.match(/^diff --git/)) {
    diffStr = `diff --git a/${ path } b/${ path }
index xxxxxxx..xxxxxxx xxxxxx
--- a/${ path }
+++ b/${ path }
${ diff }
`;
  }

  return diffStr;
}
export function getHunkFiles(a, b) {
  if (a === b) {
    return a;
  } else if (a === '/dev/null') {
    return b;
  } else if (b === '/dev/null') {
    return a;
  }
  return a + ' → ' + b;
}
export function getDiffItemType(type) {
  switch (type) {
    case 'add': return 'A';
    case 'delete': return 'D';
    case 'rename': return 'R';
    case 'copy': return 'C';
    case 'modify': return 'M';
  }
  return '';
}

export default function ReviewDiff({ data, className, shrinkBottom, repoURL }) {
  const { diffHunk, path, commit } = data;

  try {
    const parsedDiff = diffParser.parse(ensureDiffHeaderExists(diffHunk, path));

    return parsedDiff.map((diffItem, key) => {
      let filenames = getHunkFiles(diffItem.oldPath, diffItem.newPath);

      if (commit && path) {
        filenames = <a href={ `${ repoURL }/blob/${ commit.oid }/${ path }` } target='_blank'>{ filenames }</a>;
      }

      return (
        <div className={ `hunk ${ className }` } key={ key }>
          <div className='header'>
            <span className='tag'>{ getDiffItemType(diffItem.type) }</span>&nbsp;
            <span className='filenames'>{ filenames }</span>
          </div>
          <div className='lines'>
            <table className='lines-wrapper'>
              <tbody>
                {
                  diffItem.hunks.map((hunk, i) => {
                    return hunk.changes.map((change, j) => {
                      return (
                        <tr key={ `${ i }_${ j }` } className={ `code-line ${ change.type }` }>
                          <td><small className='opa5'>{ change.newLineNumber || change.lineNumber }</small></td>
                          <td><pre>{ change.content }</pre></td>
                        </tr>
                      );
                    });
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  } catch (error) {
    console.error(`Can not parse: \n\n${ diffHunk }`);
    return <pre><code>{ diffHunk }</code></pre>;
  }
}

ReviewDiff.propTypes = {
  data: PropTypes.object.isRequired,
  repoURL: PropTypes.string.isRequired,
  shrinkBottom: PropTypes.number,
  className: PropTypes.string
};
