IF NOT EXISTS (
  SELECT * FROM sysobjects WHERE name='Customers' AND xtype='U'
)
BEGIN
  CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FullName   NVARCHAR(255) NOT NULL,
    Email      NVARCHAR(255),
    CreatedAt  DATETIME
  );
END
GO

INSERT INTO Customers (CustomerID, FullName, Email, CreatedAt) VALUES
  (1,  'Alice Johnson',    'alice@example.com',            '2024-01-01 10:00:00'),
  (2,  'Bob Smith',        'bob@example.com',              '2024-01-02 12:30:00'),
  (3,  'Charlie Brown',    'CHARLIE@EXAMPLE.COM',          '2024-01-03 09:15:00'),
  (4,  'Daisy Ridley',     '',                             '2024-01-04 08:00:00'),
  (5,  'Ethan Hunt',       NULL,                           '2024-01-05 14:45:00'),
  (6,  'Frank Castle',     'frank.castle@example.com',     '2024-01-06 11:20:00'),
  (7,  'Grace Hopper',     'grace.hopper@example.com',     '2024-01-07 16:10:00'),
  (8,  'Henry Ford',       'henry.ford@example.com',       '2024-01-08 07:50:00'),
  (9,  'Isabella Garcia',  'isabella@example.com',         '2024-01-09 19:25:00'),
  (10, 'Jack Ryan',        'jack.ryan@example.com',        '2024-01-10 13:05:00');
GO
