/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import Article from './Article';

import data from './Article.data.js';

storiesOf('Components|Article', module)
    .add('with data', () => <Article {...data} />)
    .add('Image to the right', () => <Article {...data} imageRight={true} />)
    .add('without data', () => <Article />);
