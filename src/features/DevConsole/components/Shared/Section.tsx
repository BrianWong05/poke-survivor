import React from 'react';
import { styles } from '../../styles';

export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {children}
    </div>
);
