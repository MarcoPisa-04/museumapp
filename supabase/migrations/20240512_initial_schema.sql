-- Create orari table
CREATE TABLE IF NOT EXISTS orari (
  id SERIAL PRIMARY KEY,
  giorno VARCHAR(20) NOT NULL,
  apertura TIME NOT NULL,
  chiusura TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create prenotazioni table
CREATE TABLE IF NOT EXISTS prenotazioni (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  giorno DATE NOT NULL,
  persone INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial orari data
INSERT INTO orari (giorno, apertura, chiusura) VALUES
  ('Lunedì', '09:00', '18:00'),
  ('Martedì', '09:00', '18:00'),
  ('Mercoledì', '09:00', '18:00'),
  ('Giovedì', '09:00', '18:00'),
  ('Venerdì', '09:00', '18:00'),
  ('Sabato', '10:00', '20:00'),
  ('Domenica', '10:00', '20:00'); 