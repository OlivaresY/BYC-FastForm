import { MAINTENANCE_MODAL_COPY } from '../../constants/MaintenanceModalView.constants';
import { MaintenanceModalViewPageObject } from './MaintenanceModalView.po';

jest.mock('lucide-react-native', () => {
  const MockReact = jest.requireActual<typeof import('react')>('react');
  const { View: MockView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    Wrench: () => MockReact.createElement(MockView, { testID: 'mock-wrench' }),
  };
});

describe('MaintenanceModalView Component Tests', () => {
  it('renders modal root, backdrop, card, wrench icon, title, and body when isVisible is true', () => {
    const page = MaintenanceModalViewPageObject.render({ isVisible: true });

    expect(page.modalRoot).toBeTruthy();
    expect(page.modalRoot.props.visible).toBe(true);
    expect(page.modalRoot.props.transparent).toBe(true);
    expect(page.modalRoot.props.animationType).toBe('fade');

    expect(page.backdrop).toBeTruthy();
    expect(page.card).toBeTruthy();
    expect(page.iconContainer).toBeTruthy();
    expect(page.title.props.children).toBe(MAINTENANCE_MODAL_COPY.TITLE);
    expect(page.body.props.children).toBe(MAINTENANCE_MODAL_COPY.BODY);
    expect(page.queryAllButtons()).toHaveLength(0);
  });

  it('does not render modal content when isVisible is false', () => {
    const page = MaintenanceModalViewPageObject.render({ isVisible: false });

    expect(page.queryTitle()).toBeNull();
    expect(page.queryBody()).toBeNull();
  });

  it('defines a no-op onRequestClose handler that does not throw or dismiss the modal', () => {
    const page = MaintenanceModalViewPageObject.render({ isVisible: true });

    expect(typeof page.modalRoot.props.onRequestClose).toBe('function');
    expect(() => page.triggerRequestClose()).not.toThrow();
    expect(page.modalRoot.props.visible).toBe(true);
    expect(page.title.props.children).toBe(MAINTENANCE_MODAL_COPY.TITLE);
  });
});
