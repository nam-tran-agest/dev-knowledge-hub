export interface ROIField {
    id: string;
    label: string;
    // Box defined as percentages of width/height (0 to 100)
    // This allows it to work on different resolutions of the same template
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

export const ID_CARD_TEMPLATE: ScannerTemplate = {
    id: 'id-card-vn',
    name: 'Vietnamese Identity Card',
    description: 'Standard format for Vietnamese Citizen ID cards',
    fields: [
        {
            id: 'id_number',
            label: 'Số / No.',
            x: 40,
            y: 28,
            width: 50,
            height: 8,
        },
        {
            id: 'full_name',
            label: 'Họ và tên / Full name',
            x: 30,
            y: 40,
            width: 65,
            height: 9,
        },
        {
            id: 'dob',
            label: 'Ngày sinh / Date of birth',
            x: 50,
            y: 51,
            width: 30,
            height: 8,
        },
        {
            id: 'nationality',
            label: 'Quốc tịch / Nationality',
            x: 50,
            y: 59,
            width: 40,
            height: 8,
        },
        {
            id: 'address',
            label: 'Nơi cư trú / Place of residence',
            x: 35,
            y: 75,
            width: 60,
            height: 15,
        }
    ]
};

export const CREDIT_CARD_TEMPLATE: ScannerTemplate = {
    id: 'credit-card',
    name: 'Credit Card (Visa/Mastercard)',
    description: 'Standard credit card format',
    fields: [
        {
            id: 'card_number',
            label: 'Card Number',
            // Made noticeably larger to capture full number even if slanted or shifted
            x: 5,
            y: 45,
            width: 90,
            height: 25,
        },
        {
            id: 'expiry_date',
            label: 'Valid Thru',
            // Liberal box for date
            x: 35,
            y: 65,
            width: 30,
            height: 20,
        },
        {
            id: 'cardholder_name',
            label: 'Cardholder Name',
            // Lower section for name
            x: 5,
            y: 78,
            width: 70,
            height: 20,
        }
    ]
};

export const SCANNER_TEMPLATES = [CREDIT_CARD_TEMPLATE, ID_CARD_TEMPLATE];
