import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import Article from './';
// import data from './Article.data';

describe('<Article />', () => {
    it('Renders an empty Article', () => {
        const component = shallow(<Article />);
        expect(component).toBeTruthy();
    });

    // it('Renders Article with data', () => {
    //     const component = mount(<Article {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
