import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>FAQ — Часто задаваемые вопросы</Typography>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Как забронировать жильё?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          1. Найдите подходящий вариант через поиск или фильтры.<br/>
          2. Откройте страницу апартамента и выберите даты.<br/>
          3. Нажмите “Забронировать” и следуйте инструкциям.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Как отменить бронирование?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Войдите в свой профиль, откройте раздел “Мои бронирования” и выберите нужное бронирование для отмены.
        </Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Как связаться с поддержкой?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Вы можете написать нам на email info@booking-app.ru или через Telegram/WhatsApp (ссылки в футере).
        </Typography>
      </AccordionDetails>
    </Accordion>
  </Container>
);

export default FAQ; 