import {
    Sword,
    Shield,
    Zap,
    Heart,
    Target,
    Sparkles,
    User,
    Hash,
    Calendar,
    Globe,
    MapPin,
    Droplets,
    Flame,
    Wind,
    Star
} from 'lucide-react';

export interface ROIField {
    id: string;
    label: string;
    rpgLabel: string;
    icon: React.ReactNode;
    rpgIcon: React.ReactNode;
    keywords: string[]; // Keywords for global OCR search fallback
    // Box defined as percentages of width/height (0 to 100)
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ScannerTemplate {
    id: string;
    name: string;
    description: string;
    fields: ROIField[];
}

export const CHARACTER_CARD_TEMPLATE: ScannerTemplate = {
    id: 'character-card',
    name: 'Character Build Card',
    description: 'Redesigned RPG Character Stats Profile',
    fields: [
        {
            id: 'Character Name',
            label: 'Character Name',
            rpgLabel: 'Tên Nhân Vật',
            icon: <User className="w-4 h-4" />,
            rpgIcon: <User className="w-4 h-4" />,
            keywords: ['Name', 'Tên', 'Unit'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'HP',
            label: 'HP',
            rpgLabel: 'HP (Sinh Mệnh)',
            icon: <Heart className="w-4 h-4" />,
            rpgIcon: <Heart className="w-4 h-4" />,
            keywords: ['HP', 'Sinh Mệnh', 'Máu', 'Health', 'Max HP', 'HR', 'KP', 'H P', 'IBP'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'ATK',
            label: 'ATK',
            rpgLabel: 'Tấn Công',
            icon: <Sword className="w-4 h-4" />,
            rpgIcon: <Sword className="w-4 h-4" />,
            keywords: ['ATK', 'Tấn Công', 'Công', 'Attack', 'Base ATK', 'AIK', 'A TK', 'ATTACK', 'TAN CONG', 'TÂN CÔNG'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'DEF',
            label: 'DEF',
            rpgLabel: 'Phòng Ngự',
            icon: <Shield className="w-4 h-4" />,
            rpgIcon: <Shield className="w-4 h-4" />,
            keywords: ['DEF', 'Phòng Ngự', 'Thủ', 'Defense', 'DFF', 'D EF', 'DEFENSE', 'PHONG NGU', 'PHONG NGỮ'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'EM',
            label: 'Elemental Mastery',
            rpgLabel: 'Tinh Thông Nguyên Tố',
            icon: <Sparkles className="w-4 h-4" />,
            rpgIcon: <Sparkles className="w-4 h-4" />,
            keywords: ['Mastery', 'Tinh Thông', 'EM', 'Elemental Mastery', 'TINH THÔNG'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'Crit Rate',
            label: 'Crit Rate',
            rpgLabel: 'Tỷ Lệ Bạo Kích',
            icon: <Target className="w-4 h-4" />,
            rpgIcon: <Target className="w-4 h-4" />,
            keywords: ['Crit Rate', 'Tỷ Lệ Bạo', 'Bạo Kích', 'TLBK', 'CR', 'TÝ LE BAO', 'TY LE BAO'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'Crit DMG',
            label: 'Crit DMG',
            rpgLabel: 'ST Bạo Kích',
            icon: <Zap className="w-4 h-4" />,
            rpgIcon: <Zap className="w-4 h-4" />,
            keywords: ['Crit DMG', 'Sát Thương Bạo', 'STBK', 'CD', 'ST Bạo', 'SAT THƯƠNG BAO', 'ST BAO'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'ER',
            label: 'Energy Recharge',
            rpgLabel: 'Hiệu Quả Nạp Nguyên Tố',
            icon: <Zap className="w-4 h-4" />,
            rpgIcon: <Zap className="w-4 h-4" />,
            keywords: ['Energy Recharge', 'Hiệu Quả Nạp', 'Nạp Nguyên Tố', 'ER', 'Hiệu Quả Nạp Nguyên Tố', 'HIỆU QUẢ NAP'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'Elemental Bonus',
            label: 'Elemental DMG',
            rpgLabel: 'Tăng ST Nguyên Tố',
            icon: <Sparkles className="w-4 h-4" />,
            rpgIcon: <Sparkles className="w-4 h-4" />,
            keywords: ['DMG Bonus', 'Tăng ST Nguyên Tố', 'ST Thủy', 'Cryo DMG', 'Tăng ST Nguyên Tố Thủy', 'Tăng ST Nguyên Tố Hỏa', 'TANG ST'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'Weapon Name',
            label: 'Weapon',
            rpgLabel: 'Vũ Khí',
            icon: <Sword className="w-4 h-4" />,
            rpgIcon: <Sword className="w-4 h-4" />,
            keywords: ['Weapon', 'Vũ Khí', 'Thương', 'Kiếm', 'Đại Đao', 'Pháp Khí', 'Cung', 'VU KHI'],
            x: 0, y: 0, width: 0, height: 0,
        },
        {
            id: 'Artifact Set',
            label: 'Artifact Set',
            rpgLabel: 'Bộ Thánh Di Vật',
            icon: <Sparkles className="w-4 h-4" />,
            rpgIcon: <Sparkles className="w-4 h-4" />,
            keywords: ['Set', 'Bộ', 'Thánh Di Vật', 'Artifact Set', 'Hiệu Quả Bộ', 'BO THANH DI VAT'],
            x: 0, y: 0, width: 0, height: 0,
        }
    ]
};

export const SCANNER_TEMPLATES = [CHARACTER_CARD_TEMPLATE];
