import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Layout from '../../components/NavigationComponents/Layout';
import Toolbar from '../../components/NavigationComponents/Toolbar/Toolbar';
import Logo from '../../components/NavigationComponents/Logo';
import NavigationItems from '../../components/NavigationComponents/NavigationItems';

configure({adapter: new Adapter()});

describe('<Layout />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Layout />);
    });

    it('should render one <Toolbar /> elements', () => {
        expect(wrapper.find(Toolbar)).toHaveLength(1);
    });

    it('should render one <Logo /> elements', () => {
        expect(wrapper.find(Logo)).toHaveLength(1);
    });

    it('should render one <NavigationItems /> elements', () => {
        expect(wrapper.find(NavigationItems)).toHaveLength(1);
    });
});