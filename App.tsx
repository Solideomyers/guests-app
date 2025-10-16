import React, { useState, useMemo, useEffect } from 'react';
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

const ITEMS_PER_PAGE = 25;

// Allow TypeScript to recognize the jsPDF library from the window object
declare global {
  interface Window {
    jspdf: any;
  }
}

const App: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const storedGuests = localStorage.getItem('guests');
      return storedGuests ? JSON.parse(storedGuests) : initialGuestData;
    } catch (error) {
      console.error("Error reading guests from localStorage", error);
      return initialGuestData;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AttendanceStatus | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'firstName', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('guests', JSON.stringify(guests));
    } catch (error) {
      console.error("Error writing guests to localStorage", error);
    }
  }, [guests]);


  const filteredGuests = useMemo(() => {
    return guests
      .filter(guest => {
        const matchesSearch =
          `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.church.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guest.phone.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = activeFilter === 'All' || guest.status === activeFilter;

        return matchesSearch && matchesFilter;
      });
  }, [guests, searchQuery, activeFilter]);

  const sortedGuests = useMemo(() => {
    let sortableGuests = [...filteredGuests];
    if (sortConfig !== null) {
      sortableGuests.sort((a, b) => {
        const key = sortConfig.key;
        // Handle cases where values might be null or undefined
        const valA = a[key] ? a[key].toString().toLowerCase() : '';
        const valB = b[key] ? b[key].toString().toLowerCase() : '';
        
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGuests;
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


  // Stats calculation
  const stats = useMemo(() => ({
    total: guests.length,
    confirmed: guests.filter(g => g.status === AttendanceStatus.CONFIRMED).length,
    pending: guests.filter(g => g.status === AttendanceStatus.PENDING).length,
    declined: guests.filter(g => g.status === AttendanceStatus.DECLINED).length,
    pastors: guests.filter(g => g.isPastor).length,
  }), [guests]);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (status: AttendanceStatus | 'All') => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const requestSort = (key: SortableGuestKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleUpdateStatus = (id: number, newStatus: AttendanceStatus) => {
    setGuests(prevGuests => prevGuests.map(guest => guest.id === id ? { ...guest, status: newStatus } : guest));
  };
  
  const handleDeleteGuest = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este invitado?')) {
        setGuests(prevGuests => prevGuests.filter(guest => guest.id !== id));
        setSelectedGuestIds(ids => ids.filter(selectedId => selectedId !== id));
    }
  };
  
  const handleTogglePastorStatus = (id: number, isPastor: boolean) => {
      setGuests(prevGuests => prevGuests.map(guest => guest.id === id ? { ...guest, isPastor } : guest));
  };

  const handleAddGuest = (newGuestData: Omit<Guest, 'id' | 'registrationDate' | 'status'>) => {
    const isDuplicate = guests.some(
      g => g.firstName.trim().toLowerCase() === newGuestData.firstName.trim().toLowerCase() && 
           g.lastName.trim().toLowerCase() === newGuestData.lastName.trim().toLowerCase()
    );

    if (isDuplicate) {
        return false;
    }

    const newGuest: Guest = {
      ...newGuestData,
      id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
      registrationDate: new Date().toISOString().split('T')[0],
      status: AttendanceStatus.PENDING,
    };
    setGuests(prevGuests => [newGuest, ...prevGuests]);
    return true;
  };
  
  const handleExportCSV = () => {
    const headers = ["Nombre", "Apellido", "Iglesia", "Ciudad", "Estado", "Teléfono", "Pastor", "Estatus"];
    const rows = sortedGuests.map(guest => [
        `"${guest.firstName}"`,
        `"${guest.lastName}"`,
        `"${guest.church}"`,
        `"${guest.city}"`,
        `"${guest.state}"`,
        `"${guest.phone}"`,
        guest.isPastor ? 'Sí' : 'No',
        guest.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invitados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Lista de Invitados", 14, 22);

    // Stats Cards
    const statsData = [
        { title: 'Total', value: sortedGuests.length, color: '#3b82f6' },
        { title: 'Pastores', value: sortedGuests.filter(g => g.isPastor).length, color: '#8b5cf6' },
        { title: 'Confirmados', value: sortedGuests.filter(g => g.status === AttendanceStatus.CONFIRMED).length, color: '#22c55e' },
        { title: 'Pendientes', value: sortedGuests.filter(g => g.status === AttendanceStatus.PENDING).length, color: '#f59e0b' },
        { title: 'Rechazados', value: sortedGuests.filter(g => g.status === AttendanceStatus.DECLINED).length, color: '#ef4444' }
    ];

    const cardWidth = 35;
    const cardHeight = 20;
    const cardGap = 5;
    const totalWidth = (cardWidth * statsData.length) + (cardGap * (statsData.length - 1));
    let startX = (doc.internal.pageSize.getWidth() - totalWidth) / 2;
    const startY = 30;

    statsData.forEach(stat => {
        doc.setFillColor(stat.color);
        doc.roundedRect(startX, startY, cardWidth, cardHeight, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(stat.title, startX + 5, startY + 8);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(String(stat.value), startX + 5, startY + 16);
        startX += cardWidth + cardGap;
    });

    // Table
    const tableColumn = ["Nombre Completo", "Iglesia", "Ciudad", "Teléfono", "Pastor", "Estatus"];
    const tableRows = sortedGuests.map(guest => [
        `${guest.firstName} ${guest.lastName}`,
        guest.church,
        guest.city,
        guest.phone,
        guest.isPastor ? 'Sí' : 'No',
        guest.status,
    ]);

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY + cardHeight + 10,
    });

    doc.save('invitados.pdf');
  };

  const handleSelectGuest = (id: number, checked: boolean) => {
    setSelectedGuestIds(prev => checked ? [...prev, id] : prev.filter(guestId => guestId !== id));
  };

  const handleSelectAllOnPage = (checked: boolean) => {
    const pageIds = paginatedGuests.map(g => g.id);
    if (checked) {
      setSelectedGuestIds(prev => [...new Set([...prev, ...pageIds])]);
    } else {
      setSelectedGuestIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };
  
  const handleClearSelection = () => {
      setSelectedGuestIds([]);
  };
  
  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedGuestIds.length} invitados?`)) {
      setGuests(prev => prev.filter(g => !selectedGuestIds.includes(g.id)));
      handleClearSelection();
    }
  };
  
  const handleBulkUpdateStatus = (status: AttendanceStatus) => {
    setGuests(prev => prev.map(g => selectedGuestIds.includes(g.id) ? { ...g, status } : g));
    handleClearSelection();
  };

  const handleBulkMarkAsPastor = () => {
    setGuests(prev => prev.map(g => selectedGuestIds.includes(g.id) ? { ...g, isPastor: true } : g));
    handleClearSelection();
  };
  
  const handleBulkUnmarkAsPastor = () => {
    setGuests(prev => prev.map(g => selectedGuestIds.includes(g.id) ? { ...g, isPastor: false } : g));
    handleClearSelection();
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        {/* Stats Section */}
        <section className="max-w-max mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <StatsCard title="Total Invitados" value={stats.total} icon="users" color="bg-blue-500" />
          <StatsCard title="Confirmados" value={stats.confirmed} icon="check-circle" color="bg-green-500" />
          <StatsCard title="Pendientes" value={stats.pending} icon="clock" color="bg-yellow-500" />
          <StatsCard title="Rechazados" value={stats.declined} icon="x-circle" color="bg-red-500" />
          <StatsCard title="Pastores" value={stats.pastors} icon="user-circle" color="bg-purple-500" />
        </section>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <ExportButtons onExportCSV={handleExportCSV} onExportPDF={handleExportPDF} />
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full sm:w-auto"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span>Añadir</span>
                </button>
            </div>
          </div>
          
          <StatusFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />

          {selectedGuestIds.length > 0 && (
            <div className="my-4">
              <BulkActionsToolbar
                selectedCount={selectedGuestIds.length}
                onDelete={handleBulkDelete}
                onUpdateStatus={handleBulkUpdateStatus}
                onClearSelection={handleClearSelection}
                onMarkAsPastor={handleBulkMarkAsPastor}
                onUnmarkAsPastor={handleBulkUnmarkAsPastor}
              />
            </div>
          )}

          {/* Table Section */}
          <GuestTable
            guests={paginatedGuests}
            onUpdateStatus={handleUpdateStatus}
            onDeleteGuest={handleDeleteGuest}
            onTogglePastorStatus={handleTogglePastorStatus}
            requestSort={requestSort}
            sortConfig={sortConfig}
            selectedGuestIds={selectedGuestIds}
            onSelectGuest={handleSelectGuest}
            onSelectAllOnPage={handleSelectAllOnPage}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedGuests.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </main>
      
      <AddGuestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddGuest={handleAddGuest}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default App;