import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Formik } from 'formik';

import AddTrainingSchema from '../../components/TrainingComponents/AddTrainingSchema';

configure({adapter: new Adapter()});

describe('<AddTrainingSchema />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<AddTrainingSchema />);
    });

    it('should render one <Form> element', () => {
        expect(wrapper.find(Formik)).toHaveLength(1);
    });
});