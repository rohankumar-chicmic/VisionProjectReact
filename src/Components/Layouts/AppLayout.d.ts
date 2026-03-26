import React from 'react';

export interface AppLayoutProps {
    isAuthenticated?: boolean;
    children: React.ReactNode;
}