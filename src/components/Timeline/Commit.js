import React from 'react';
import PropTypes from 'prop-types';

import Diff from '../utils/Diff';
import Date from '../utils/Date';
import { GIT_COMMIT } from '../Icons';
import trim from '../utils/trim';
import { withHorn } from '../Horn';

function Commit({ event, dim }) {
  const cls = `timeline-thread-comment media small relative ${ dim ? 'dim' : ''}`;

  return (
    <div className={ cls } id={ event.id }>
      <img src={ event.author.avatar } className='avatar' title={ event.author.login }/>
      <div>
        <Date event={ event }/>&nbsp;
        <span className='iblock'>
          <GIT_COMMIT size={ 18 }/>
          { trim(event.message) }
        </span>&nbsp;
        <small className='opa5'>
          <a href={ event.url } target='_blank'>{ event.oid.substr(0, 7) }</a>
        </small>
        <Diff data={ event } className='opa5'/>
      </div>
    </div>
  );
};

Commit.propTypes = {
  event: PropTypes.object.isRequired,
  dim: PropTypes.bool
};

export default withHorn(Commit);
