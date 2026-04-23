import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './header';
import useTableStore from '../../store/tableStore';

// I'll likely have to mock the zustand store, then spy on calls to the actions

describe('Header', () => {
    it('renders with initial value', () => {
        render(<Header />);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        // expect(useTableStore.getState().headerHeight).toBeGreaterThan(0);
    });

    it('opens the sidebar when settings button is clicked', async () => {
        render(<Header />);
        // fireEvent.click(screen.getByText('Settings'));
        // await screen.findByRole('complementary');
        // expect(screen.getByRole('complementary')).toBeInTheDocument();
    })
});