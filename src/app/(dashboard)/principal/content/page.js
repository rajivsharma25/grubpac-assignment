'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, Badge } from '@/components/ui/DataDisplay';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { contentService } from '@/services/content.service';
import { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, User } from 'lucide-react';

export default function AllContentPage() {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAll = async () => {
      const data = await contentService.getAll();
      setContents(data);
      setFilteredContents(data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    let result = contents;
    
    if (search) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        c.teacherName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter);
    }

    setFilteredContents(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [search, statusFilter, contents]);

  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const paginatedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text"
                placeholder="Search by title, subject, or teacher..."
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status:</span>
               <select 
                className="bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="ALL">All Status</option>
                 <option value="PENDING">Pending</option>
                 <option value="APPROVED">Approved</option>
                 <option value="REJECTED">Rejected</option>
               </select>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="overflow-hidden border-none shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Content</th>
                    <th className="px-8 py-5">Teacher</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedContents.map((content) => (
                    <tr key={content.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-8 py-5">
                        <div>
                          <div className="font-black text-foreground text-sm tracking-tight">{content.title}</div>
                          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{content.subject}</div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center text-muted-foreground font-medium text-xs">
                          <User size={14} className="mr-2 opacity-50" /> {content.teacherName}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {content.status === 'PENDING' && <Badge variant="warning">Pending</Badge>}
                        {content.status === 'APPROVED' && <Badge variant="success">Approved</Badge>}
                        {content.status === 'REJECTED' && <Badge variant="error">Rejected</Badge>}
                      </td>
                      <td className="px-8 py-5 text-right text-muted-foreground text-xs font-medium">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredContents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <Search size={40} className="text-muted-foreground opacity-20 mb-4" />
                          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No results found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
