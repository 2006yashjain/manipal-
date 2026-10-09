import { LegalProvision } from '../types/legal';

/**
 * Local legal source registry for Stage 4 prototype.
 * Sources are based on real Indian legislation.
 * Do NOT fabricate section numbers — only use verified provisions.
 */
export const legalSources: LegalProvision[] = [
  {
    id: 'cpa-2019-s2-7',
    title: 'Definition of Consumer',
    provision: 'Section 2(7)',
    act: 'Consumer Protection Act, 2019',
    sourceName: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13689/1/co_protection_act_2019.pdf',
    summary:
      '"Consumer" means any person who buys any goods for a consideration which has been paid or promised or partly paid and partly promised, or under any system of deferred payment, and includes any user of such goods other than the person who buys such goods for consideration paid or promised; but does not include a person who obtains such goods for resale or for any commercial purpose.',
    relevantFactors: [
      'Transaction type (goods or service)',
      'Consideration paid or promised',
      'Purpose of purchase (personal vs commercial vs resale)',
      'Identity of purchaser vs user',
    ],
  },
  {
    id: 'cpa-2019-s2-34',
    title: 'Definition of Unfair Trade Practice',
    provision: 'Section 2(47)',
    act: 'Consumer Protection Act, 2019',
    sourceName: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13689/1/co_protection_act_2019.pdf',
    summary:
      '"Unfair trade practice" means a trade practice which, for the purpose of promoting the sale, use or supply of any goods or for the provision of any service, adopts any unfair method or deceptive practice including representing falsely that goods are of a particular standard, quality, quantity, grade, composition, style, or model.',
    relevantFactors: [
      'Product described differently from what was delivered',
      'Goods not matching specification on invoice or listing',
    ],
  },
  {
    id: 'cpa-2019-s2-11',
    title: 'Definition of Deficiency',
    provision: 'Section 2(11)',
    act: 'Consumer Protection Act, 2019',
    sourceName: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13689/1/co_protection_act_2019.pdf',
    summary:
      '"Deficiency" means any fault, imperfection, shortcoming, or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law for the time being in force or has been undertaken to be performed by a person in pursuance of a contract or otherwise in relation to any service and includes any act of negligence or omission or commission by such person which causes loss or injury to the consumer.',
    relevantFactors: [
      'Defective product delivered',
      'Failure to process refund',
      'Seller non-response to complaint',
    ],
  },
  {
    id: 'cpa-2019-s35',
    title: 'Consumer Complaint — District Commission',
    provision: 'Section 35',
    act: 'Consumer Protection Act, 2019',
    sourceName: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13689/1/co_protection_act_2019.pdf',
    summary:
      'A complaint in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided may be filed with a District Consumer Disputes Redressal Commission by the consumer or a recognised consumer association.',
    relevantFactors: [
      'Transaction value up to ₹50 lakh',
      'Consumer complaint filing threshold',
    ],
  },
  {
    id: 'cpa-2019-s2-6',
    title: 'Consumer Rights — Right to be protected from defective goods',
    provision: 'Section 2(9)(i)',
    act: 'Consumer Protection Act, 2019',
    sourceName: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/bitstream/123456789/13689/1/co_protection_act_2019.pdf',
    summary:
      'Consumer rights include the right to be protected against the marketing of goods and services which are hazardous to life and property, and the right to be informed about the quality, quantity, potency, purity, standard and price of goods or services.',
    relevantFactors: [
      'Product arrived in damaged condition',
      'Consumer not provided accurate product information',
    ],
  },
];

export function getLegalSourceById(id: string): LegalProvision | undefined {
  return legalSources.find(s => s.id === id);
}
