import { PageWrapper } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Building2,
  FolderKanban,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Active Employees',
    value: '10',
    change: '+2',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Customers',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Building2,
  },
  {
    title: 'Active Projects',
    value: '12',
    change: '+5',
    trend: 'up',
    icon: FolderKanban,
  },
  {
    title: 'Monthly Revenue',
    value: 'AED 185,000',
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      description="Welcome back! Here's an overview of your business."
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Tahseel Logo Reveal', customer: 'TAHSEEL Information Technology', status: 'In Progress' },
                { name: 'SEDD Nov + Dec Posts', customer: 'Sharjah Economic Development', status: 'In Progress' },
                { name: 'Al Majaz Event Campaign', customer: 'Al Majaz Waterfront', status: 'Concept' },
                { name: 'Bee\'ah Sustainability Report', customer: 'Bee\'ah', status: 'Design' },
              ].map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.customer}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { number: 'IN01011', customer: 'TAHSEEL', amount: 'AED 6,300', due: 'Jan 14, 2026' },
                { number: 'IN01010', customer: 'SEDD', amount: 'AED 11,970', due: 'Jan 28, 2026' },
                { number: 'IN01009', customer: 'Al Majaz', amount: 'AED 8,400', due: 'Feb 5, 2026' },
              ].map((invoice) => (
                <div
                  key={invoice.number}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lor-coral">{invoice.amount}</p>
                    <p className="text-xs text-muted-foreground">Due: {invoice.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
