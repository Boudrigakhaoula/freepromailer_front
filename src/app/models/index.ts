export interface Campaign {
  id: number;
  name: string;
  subject: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'DRAFT' | 'FAILED';
  progress: number;
  type: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: 'Subscribed' | 'Unsubscribed' | 'Pending';
  tags: string[];
  date: string;
}

export interface Template {
  id: number;
  name: string;
  category: string;
  lastUsed: string;
  image: string;
}

export interface Workflow {
  id: number;
  name: string;
  status: 'Active' | 'Paused' | 'Draft';
  triggers: string;
  contacts: number;
  openRate: string;
  clickRate: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface KpiCard {
  label: string;
  value: string;
  trend: 'up' | 'down';
  trendValue: string;
  positive?: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}
