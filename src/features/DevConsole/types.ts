

export interface ActiveWeapon {
    id: string;
    name: string;
    level: number;
}

export interface ActiveItem {
    id: string;
    name: string;
    level: number;
}

export interface DevMove {
    name: string;
    create: () => any; // Using any here because it returns various weapon class instances or configs
    outline?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    outline?: boolean;
    color?: string;
}
