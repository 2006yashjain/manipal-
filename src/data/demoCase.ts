import { ConsumerCaseInput } from '../types';

export const syntheticDemoCase: ConsumerCaseInput = {
  id: 'CASE-NS-2026-001',
  orderId: 'ORD-78291',
  purchaseDate: '2026-09-12',
  platform: 'ExampleMart',
  seller: 'TechWorld Store',
  amount: '54,999',
  currency: 'INR (₹)',
  story: 'I ordered a Dell Inspiron 15 laptop from ExampleMart. The package arrived with visible damage. I contacted the seller and requested a refund, but the refund has not been confirmed.',
  issueCategory: 'defective_not_as_described',
  remedies: ['Refund'],
  parties: {
    marketplace: 'ExampleMart',
    seller: 'TechWorld Store',
    paymentProvider: 'ExamplePay',
    logistics: 'FastShip',
    other: '',
  },
  consentGiven: true,
  status: 'draft_story',
  createdAt: '2026-10-09',
};

export const emptyCaseInput: ConsumerCaseInput = {
  id: `CASE-NS-${Math.floor(1000 + Math.random() * 9000)}`,
  orderId: '',
  purchaseDate: '',
  platform: '',
  seller: '',
  amount: '',
  currency: 'INR (₹)',
  story: '',
  issueCategory: null,
  remedies: [],
  parties: {
    marketplace: '',
    seller: '',
    paymentProvider: '',
    logistics: '',
    other: '',
  },
  consentGiven: false,
  status: 'draft_story',
  createdAt: new Date().toISOString().split('T')[0],
};
