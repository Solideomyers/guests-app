import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Guest, AttendanceStatus, SortConfig, SortableGuestKeys } from './types';
import { initialGuestData } from './constants';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import GuestTable from './components/GuestTable';
import Pagination from './components/Pagination';
import AddGuestModal from './components/AddGuestModal';
import ExportButtons from './components/ExportButtons';
import ScrollToTopButton from './components/ScrollToTopButton';
import BulkActionsToolbar from './components/BulkActionsToolbar';

const ITEMS_PER_PAGE = 20;

// Since jsPDF is from a script tag, declare it on the window object
declare global {
    interface Window {
        jspdf: any;
    }
}

const App: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(initialGuestData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AttendanceStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'firstName', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<Set<number>>(new Set());

  const filteredGuests = useMemo(() => {
    return guests
      .filter(guest => {
        if (activeFilter === 'All') return true;
        return guest.status === activeFilter;
      })
      .filter(guest => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          guest.firstName.toLowerCase().includes(searchTerm) ||
          guest.lastName.toLowerCase().includes(searchTerm) ||
          guest.church.toLowerCase().includes(searchTerm) ||
          guest.city.toLowerCase().includes(searchTerm) ||
          guest.phone.toLowerCase().includes(searchTerm)
        );
      });
  }, [guests, searchQuery, activeFilter]);

  const sortedGuests = useMemo(() => {
    let sortableItems = [...filteredGuests];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredGuests, sortConfig]);

  const paginatedGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedGuests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedGuests, currentPage]);

  const totalPages = Math.ceil(sortedGuests.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const total = guests.length;
    const confirmed = guests.filter(g => g.status === AttendanceStatus.CONFIRMED).length;
    const pending = guests.filter(g => g.status === AttendanceStatus.PENDING).length;
    const declined = guests.filter(g => g.status === AttendanceStatus.DECLINED).length;
    const pastors = guests.filter(g => g.isPastor).length;
    return { total, confirmed, pending, declined, pastors };
  }, [guests]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setSelectedGuests(new Set());
  };

  const handleFilterChange = (status: AttendanceStatus | 'All') => {
    setActiveFilter(status);
    setCurrentPage(1);
    setSelectedGuests(new Set());
  };

  const handleSort = (key: SortableGuestKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setSelectedGuests(new Set());
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedGuests(new Set());
  };

  const handleUpdateGuestStatus = useCallback((id: number, status: AttendanceStatus) => {
    setGuests(prevGuests =>
      prevGuests.map(guest => (guest.id === id ? { ...guest, status } : guest))
    );
  }, []);
  
  const handleTogglePastorStatus = useCallback((id: number, isPastor: boolean) => {
    setGuests(prevGuests =>
      prevGuests.map(guest => (guest.id === id ? { ...guest, isPastor } : guest))
    );
  }, []);

  const handleSaveGuest = (guestData: Omit<Guest, 'registrationDate' | 'status'>) => {
    const isDuplicate = guests.some(
      g => g.id !== guestData.id &&
           g.firstName.toLowerCase() === guestData.firstName.toLowerCase() &&
           g.lastName.toLowerCase() === guestData.lastName.toLowerCase()
    );

    if (isDuplicate) {
      return false; // Indicate failure due to duplicate
    }
    
    if ('id' in guestData && guestData.id) {
      setGuests(guests.map(g => g.id === guestData.id ? { ...g, ...guestData } : g));
    } else {
      const newGuest: Guest = {
        ...guestData,
        id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
        registrationDate: new Date().toISOString().split('T')[0],
        status: AttendanceStatus.PENDING,
      };
      setGuests([newGuest, ...guests]);
    }
    setIsModalOpen(false);
    setEditingGuest(null);
    return true; // Indicate success
  };
  
  const handleOpenAddModal = () => {
    setEditingGuest(null);
    setIsModalOpen(true);
  };

  const handleEditGuest = useCallback((guest: Guest) => {
    setEditingGuest(guest);
    setIsModalOpen(true);
  }, []);

  const handleDeleteGuest = useCallback((id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este invitado?')) {
        setGuests(guests.filter(g => g.id !== id));
        setSelectedGuests(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    }
  }, [guests]);

  const handleSelectGuest = useCallback((id: number) => {
    setSelectedGuests(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleSelectAllGuests = useCallback(() => {
    if (selectedGuests.size === paginatedGuests.length && paginatedGuests.length > 0) {
      setSelectedGuests(new Set());
    } else {
      setSelectedGuests(new Set(paginatedGuests.map(g => g.id)));
    }
  }, [selectedGuests.size, paginatedGuests]);

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${selectedGuests.size} invitados?`)) {
      setGuests(guests.filter(g => !selectedGuests.has(g.id)));
      setSelectedGuests(new Set());
    }
  };

  const handleBulkStatusChange = (status: AttendanceStatus) => {
    setGuests(guests.map(g => selectedGuests.has(g.id) ? { ...g, status } : g));
    setSelectedGuests(new Set());
  };
  
  const handleBulkSetPastorStatus = (isPastor: boolean) => {
    setGuests(guests.map(g => selectedGuests.has(g.id) ? { ...g, isPastor } : g));
    setSelectedGuests(new Set());
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nombre", "Apellido", "Iglesia", "Ciudad", "Teléfono", "Estatus", "Es Pastor"];
    const rows = sortedGuests.map(guest => [
      guest.id,
      guest.firstName,
      guest.lastName,
      guest.church,
      guest.city,
      guest.phone,
      guest.status,
      guest.isPastor ? "Sí" : "No"
    ].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_de_invitados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF() as any;
    
    doc.setFontSize(20);
    doc.text("Resumen de Invitados", 14, 22);

    const currentStats = {
      total: sortedGuests.length,
      pastors: sortedGuests.filter(g => g.isPastor).length,
      confirmed: sortedGuests.filter(g => g.status === AttendanceStatus.CONFIRMED).length,
      pending: sortedGuests.filter(g => g.status === AttendanceStatus.PENDING).length,
      declined: sortedGuests.filter(g => g.status === AttendanceStatus.DECLINED).length,
    }

    const cardData = [
      { title: "Total", value: currentStats.total, color: [229, 231, 235] },
      { title: "Pastores", value: currentStats.pastors, color: [233, 213, 255] },
      { title: "Confirmados", value: currentStats.confirmed, color: [220, 252, 231] },
      { title: "Pendientes", value: currentStats.pending, color: [254, 249, 195] },
      { title: "Rechazados", value: currentStats.declined, color: [254, 226, 226] },
    ];
    
    let startX = 14;
    cardData.forEach(card => {
        doc.setFillColor(...card.color);
        doc.roundedRect(startX, 30, 35, 20, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(card.title, startX + 5, 38);
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(card.value.toString(), startX + 5, 46);
        startX += 40;
    });

    const tableColumn = ["Nombre Completo", "Iglesia", "Ciudad", "Teléfono", "Estatus", "Pastor"];
    const tableRows = sortedGuests.map(guest => [
      `${guest.firstName} ${guest.lastName}`,
      guest.church,
      guest.city,
      guest.phone || 'N/A',
      guest.status,
      guest.isPastor ? 'Sí' : 'No'
    ]);
    
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] }
    });
    
    doc.save('lista_de_invitados.pdf');
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center mb-8">
          <section className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-max mx-auto">
            <StatsCard title="Total Invitados" value={stats.total} colorClass="bg-blue-100 text-blue-600" />
            <StatsCard title="Pastores" value={stats.pastors} colorClass="bg-purple-100 text-purple-600" />
            <StatsCard title="Confirmados" value={stats.confirmed} colorClass="bg-green-100 text-green-600" />
            <StatsCard title="Pendientes" value={stats.pending} colorClass="bg-yellow-100 text-yellow-600" />
            <StatsCard title="Rechazados" value={stats.declined} colorClass="bg-red-100 text-red-600" />
          </section>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
           <div className="p-4 md:p-6 space-y-4">
             {selectedGuests.size > 0 ? (
                <BulkActionsToolbar 
                    selectedCount={selectedGuests.size}
                    onClearSelection={() => setSelectedGuests(new Set())}
                    onDelete={handleBulkDelete}
                    onChangeStatus={handleBulkStatusChange}
                    onSetPastorStatus={handleBulkSetPastorStatus}
                />
             ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <SearchBar value={searchQuery} onChange={handleSearchChange} />
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <ExportButtons onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
                    <button
                      onClick={handleOpenAddModal}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span>Añadir Invitado</span>
                    </button>
                  </div>
                </div>
             )}
            <StatusFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          </div>
          
          <GuestTable
            guests={paginatedGuests}
            onSort={handleSort}
            sortConfig={sortConfig}
            onUpdateStatus={handleUpdateGuestStatus}
            onTogglePastorStatus={handleTogglePastorStatus}
            onSelectGuest={handleSelectGuest}
            selectedGuests={selectedGuests}
            onSelectAll={handleSelectAllGuests}
            isAllSelected={selectedGuests.size === paginatedGuests.length && paginatedGuests.length > 0}
            onDeleteGuest={handleDeleteGuest}
            onEditGuest={handleEditGuest}
          />

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={sortedGuests.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </div>
      </main>
      
      <AddGuestModal
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingGuest(null);
        }}
        onSave={handleSaveGuest}
        guestToEdit={editingGuest}
      />

      <ScrollToTopButton />
    </div>
  );
};

export default App;
