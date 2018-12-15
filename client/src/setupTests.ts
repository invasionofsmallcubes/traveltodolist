import { configure } from 'enzyme';
// @ts-ignore
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });