import { Person } from "./lulus";

    export const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Participant data structure
  export const participants: Person[] = [
    { id: 1, name: "Deborah", date: "10/01", month: "01", gives_to: "Stella", gives_to_id: 3, favorite_color: "Blue", hobbies: "Reading, Cooking" },
    { id: 2, name: "Ana Paula", date: "18/01", month: "01", gives_to: "Aninha", gives_to_id: 8, favorite_color: "Purple", hobbies: "Photography, Travel" },
    { id: 3, name: "Stella", date: "04/04", month: "04", gives_to: "Sueli", gives_to_id: 4, favorite_color: "Green", hobbies: "Gardening, Yoga" },
    { id: 4, name: "Sueli", date: "09/04", month: "04", gives_to: "Camila", gives_to_id: 15, favorite_color: "Red", hobbies: "Dancing, Music" },
    { id: 5, name: "Deia", date: "15/05", month: "05", gives_to: "Aline", gives_to_id: 17, favorite_color: "Pink", hobbies: "Painting, Swimming" },
    { id: 6, name: "Carol Maita", date: "28/05", month: "05", gives_to: "Nani", gives_to_id: 14, favorite_color: "Yellow", hobbies: "Running, Baking" },
    { id: 7, name: "Josy", date: "15/07", month: "07", gives_to: "Carol Maita", gives_to_id: 6, favorite_color: "Orange", hobbies: "Tennis, Writing" },
    { id: 8, name: "Aninha", date: "09/08", month: "08", gives_to: "Carol Mori", gives_to_id: 12, favorite_color: "Teal", hobbies: "Hiking, Drawing" },
    { id: 9, name: "Letícia", date: "24/08", month: "08", gives_to: "Deborah", gives_to_id: 1, favorite_color: "Navy", hobbies: "Singing, Dancing" },
    { id: 10, name: "Sylvia", date: "03/09", month: "09", gives_to: "Vládia", gives_to_id: 16, favorite_color: "Burgundy", hobbies: "Chess, Reading" },
    { id: 11, name: "Vanessa", date: "07/09", month: "09", gives_to: "Josy", gives_to_id: 7, favorite_color: "Violet", hobbies: "Cycling, Cooking" },
    { id: 12, name: "Carol Mori", date: "26/09", month: "09", gives_to: "Ana Paula", gives_to_id: 2, favorite_color: "Mint", hobbies: "Pottery, Yoga" },
    { id: 13, name: "Vivi", date: "30/09", month: "09", gives_to: "Cássia", gives_to_id: 18, favorite_color: "Coral", hobbies: "Photography, Art" },
    { id: 14, name: "Nani", date: "26/10", month: "10", gives_to: "Vanessa", gives_to_id: 11, favorite_color: "Lavender", hobbies: "Gaming, Music" },
    { id: 15, name: "Camila", date: "15/11", month: "11", gives_to: "Deia", gives_to_id: 5, favorite_color: "Turquoise", hobbies: "Dancing, Travel" },
    { id: 16, name: "Vládia", date: "16/11", month: "11", gives_to: "Sylvia", gives_to_id: 10, favorite_color: "Gold", hobbies: "Writing, Running" },
    { id: 17, name: "Aline", date: "27/11", month: "11", gives_to: "Letícia", gives_to_id: 9, favorite_color: "Silver", hobbies: "Swimming, Reading" },
    { id: 18, name: "Cássia", date: "11/12", month: "12", gives_to: "Vivi", gives_to_id: 13, favorite_color: "Indigo", hobbies: "Yoga, Painting" }
  ];
  

    export   const filteredAndSortedParticipants = (searchTerm: string, filterMonth: string,sortBy: string)=> participants
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                p.gives_to.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesMonth = filterMonth === 'all' || p.month === filterMonth;
            return matchesSearch && matchesMonth;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return (parseInt(a.month) * 100 + parseInt(a.date.split('/')[0])) - 
                           (parseInt(b.month) * 100 + parseInt(b.date.split('/')[0]));
                case 'gives_to':
                    return a.gives_to.localeCompare(b.gives_to);
                default:
                    return 0;
            }
        });
