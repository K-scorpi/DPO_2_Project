import React, { useState, useEffect, useRef } from 'react';
import { Container, Grid, Typography, Box, TextField, InputAdornment, IconButton, Slider, MenuItem, Checkbox, FormControlLabel, FormGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentCard from '../components/ApartmentCard';
import CategoriesTabs from '../components/CategoriesTabs';
import { getApartments } from '../services/api';
import EmptyState from '../components/EmptyState';
import ScrollToTopButton from '../components/ScrollToTopButton';

const allAmenities = [
  { key: 'wifi', label: 'Wi-Fi' },
  { key: 'parking', label: 'Парковка' },
  { key: 'kitchen', label: 'Кухня' },
];

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [city, setCity] = useState('');
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySuperhost, setOnlySuperhost] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showFiltersBtn, setShowFiltersBtn] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await getApartments();
        const data = Array.isArray(response.data) ? response.data : response.data.results;
        setApartments(data || []);
        // Установим диапазон цен по данным
        if (data && data.length > 0) {
          const prices = data.map(a => Number(a.price));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (error) {
        setError('Ошибка при загрузке апартаментов');
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setShowFiltersBtn(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowFiltersBtn(false); // скроллим вниз — скрыть
      } else {
        setShowFiltersBtn(true); // скроллим вверх — показать
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Список городов для фильтра
  const cities = Array.from(new Set(apartments.map(a => a.location)));

  // Фильтрация
  const filtered = apartments.filter(a => {
    // Поиск по названию и городу
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    // Цена
    const price = Number(a.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    // Город
    const matchesCity = !city || a.location === city;
    // Новое
    const isNew = a.created_at && (Date.now() - new Date(a.created_at).getTime() < 7 * 24 * 60 * 60 * 1000);
    const matchesNew = !onlyNew || isNew;
    // Суперхозяин (тестово: цена > 2000)
    const isSuperhost = a.price > 2000;
    const matchesSuperhost = !onlySuperhost || isSuperhost;
    // Удобства (тестово: все квартиры имеют все удобства)
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(am => ['wifi','parking','kitchen'].includes(am));
    return matchesSearch && matchesPrice && matchesCity && matchesNew && matchesSuperhost && matchesAmenities;
  });

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCategoryChange = (e, newValue) => setCategory(newValue);
  const handlePriceChange = (e, newValue) => setPriceRange(newValue);
  const handleCityChange = (e) => setCity(e.target.value);
  const handleAmenityChange = (am) => {
    setSelectedAmenities(prev => prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am]);
  };

  // UI фильтров (выделено в отдельную функцию для переиспользования)
  const FiltersUI = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 260 }}>
      <TextField
        variant="outlined"
        placeholder="Где — Поиск"
        value={search}
        onChange={handleSearchChange}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ borderRadius: 8, background: '#fff', mb: 1 }}
      />
      <Box>
        <Typography variant="caption">Цена, руб.</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          min={Math.min(...apartments.map(a => Number(a.price)), 0)}
          max={Math.max(...apartments.map(a => Number(a.price)), 10000)}
          valueLabelDisplay="auto"
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>
      <TextField
        select
        label="Город"
        value={city}
        onChange={handleCityChange}
        size="small"
        sx={{ width: '100%', mb: 1 }}
      >
        <MenuItem value="">Все</MenuItem>
        {cities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} />}
          label="Новое"
        />
        <FormControlLabel
          control={<Checkbox checked={onlySuperhost} onChange={e => setOnlySuperhost(e.target.checked)} />}
          label="Суперхозяин"
        />
      </FormGroup>
      <Typography variant="caption" sx={{ mt: 1 }}>Удобства</Typography>
      <FormGroup>
        {allAmenities.map(am => (
          <FormControlLabel
            key={am.key}
            control={<Checkbox checked={selectedAmenities.includes(am.key)} onChange={() => handleAmenityChange(am.key)} />}
            label={am.label}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {showFiltersBtn && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="outlined" color="primary" onClick={() => setFiltersOpen(true)}>
            Фильтры
          </Button>
        </Box>
      )}
      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Фильтры</DialogTitle>
        <Divider />
        <DialogContent>{FiltersUI}</DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => { setSearch(''); setCategory(0); setPriceRange([0, 10000]); setCity(''); setOnlyNew(false); setOnlySuperhost(false); setSelectedAmenities([]); }} color="secondary">Сбросить фильтры</Button>
          <Button onClick={() => setFiltersOpen(false)} color="primary">Показать</Button>
        </DialogActions>
      </Dialog>
      <CategoriesTabs value={category} onChange={handleCategoryChange} />
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 3 } }}>
        Жилье
      </Typography>
      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : error ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>Повторить</Button>
        </Box>
      ) : filtered.length === 0 ? (
        <EmptyState text="Ничего не найдено по вашему запросу" />
      ) : (
        <Grid container spacing={{ xs: 2, sm: 4 }} justifyContent="flex-start">
          {filtered.map((apartment) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={apartment.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <ApartmentCard apartment={apartment} />
            </Grid>
          ))}
        </Grid>
      )}
      <ScrollToTopButton />
    </Container>
  );
};

export default Apartments; 