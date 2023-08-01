-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 12, 2022 at 02:27 PM
-- Server version: 5.7.40-log
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onlineapp_jupitermeet_pro`
--

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` tinyint(1) NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `redeems` int(11) DEFAULT '0',
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`name`, `code`, `symbol`) VALUES
('Leke', 'ALL', 'Lek'),
('Dollars', 'USD', '$'),
('Afghanis', 'AFN', '؋'),
('Pesos', 'ARS', '$'),
('Guilders', 'AWG', 'ƒ'),
('Dollars', 'AUD', '$'),
('New Manats', 'AZN', 'ман'),
('Dollars', 'BSD', '$'),
('Dollars', 'BBD', '$'),
('Rubles', 'BYR', 'p.'),
('Euro', 'EUR', '€'),
('Dollars', 'BZD', 'BZ$'),
('Dollars', 'BMD', '$'),
('Bolivianos', 'BOB', '$b'),
('Convertible Marka', 'BAM', 'KM'),
('Pula', 'BWP', 'P'),
('Leva', 'BGN', 'лв'),
('Reais', 'BRL', 'R$'),
('Pounds', 'GBP', '£'),
('Dollars', 'BND', '$'),
('Riels', 'KHR', '៛'),
('Dollars', 'CAD', '$'),
('Dollars', 'KYD', '$'),
('Pesos', 'CLP', '$'),
('Yuan Renminbi', 'CNY', '¥'),
('Pesos', 'COP', '$'),
('Colón', 'CRC', '₡'),
('Kuna', 'HRK', 'kn'),
('Pesos', 'CUP', '₱'),
('Koruny', 'CZK', 'Kč'),
('Kroner', 'DKK', 'kr'),
('Pesos', 'DOP', 'RD$'),
('Dollars', 'XCD', '$'),
('Pounds', 'EGP', '£'),
('Colones', 'SVC', '$'),
('Pounds', 'FKP', '£'),
('Dollars', 'FJD', '$'),
('Cedis', 'GHC', '¢'),
('Pounds', 'GIP', '£'),
('Quetzales', 'GTQ', 'Q'),
('Pounds', 'GGP', '£'),
('Dollars', 'GYD', '$'),
('Lempiras', 'HNL', 'L'),
('Dollars', 'HKD', '$'),
('Forint', 'HUF', 'Ft'),
('Kronur', 'ISK', 'kr'),
('Rupees', 'INR', '₹'),
('Rupiahs', 'IDR', 'Rp'),
('Rials', 'IRR', '﷼'),
('Pounds', 'IMP', '£'),
('New Shekels', 'ILS', '₪'),
('Dollars', 'JMD', 'J$'),
('Yen', 'JPY', '¥'),
('Pounds', 'JEP', '£'),
('Tenge', 'KZT', 'лв'),
('Won', 'KPW', '₩'),
('Won', 'KRW', '₩'),
('Soms', 'KGS', 'лв'),
('Kips', 'LAK', '₭'),
('Lati', 'LVL', 'Ls'),
('Pounds', 'LBP', '£'),
('Dollars', 'LRD', '$'),
('Switzerland Francs', 'CHF', 'CHF'),
('Litai', 'LTL', 'Lt'),
('Denars', 'MKD', 'ден'),
('Ringgits', 'MYR', 'RM'),
('Rupees', 'MUR', '₨'),
('Pesos', 'MXN', '$'),
('Tugriks', 'MNT', '₮'),
('Meticais', 'MZN', 'MT'),
('Dollars', 'NAD', '$'),
('Rupees', 'NPR', '₨'),
('Guilders', 'ANG', 'ƒ'),
('Dollars', 'NZD', '$'),
('Cordobas', 'NIO', 'C$'),
('Nairas', 'NGN', '₦'),
('Krone', 'NOK', 'kr'),
('Rials', 'OMR', '﷼'),
('Rupees', 'PKR', '₨'),
('Balboa', 'PAB', 'B/.'),
('Guarani', 'PYG', 'Gs'),
('Nuevos Soles', 'PEN', 'S/.'),
('Pesos', 'PHP', 'Php'),
('Zlotych', 'PLN', 'zł'),
('Rials', 'QAR', '﷼'),
('New Lei', 'RON', 'lei'),
('Rubles', 'RUB', 'руб'),
('Pounds', 'SHP', '£'),
('Riyals', 'SAR', '﷼'),
('Dinars', 'RSD', 'Дин.'),
('Rupees', 'SCR', '₨'),
('Dollars', 'SGD', '$'),
('Dollars', 'SBD', '$'),
('Shillings', 'SOS', 'S'),
('Rand', 'ZAR', 'R'),
('Rupees', 'LKR', '₨'),
('Kronor', 'SEK', 'kr'),
('Dollars', 'SRD', '$'),
('Pounds', 'SYP', '£'),
('New Dollars', 'TWD', 'NT$'),
('Baht', 'THB', '฿'),
('Dollars', 'TTD', 'TT$'),
('Lira', 'TRY', '₺'),
('Liras', 'TRL', '£'),
('Dollars', 'TVD', '$'),
('Hryvnia', 'UAH', '₴'),
('Pesos', 'UYU', '$U'),
('Sums', 'UZS', 'лв'),
('Bolivares Fuertes', 'VEF', 'Bs'),
('Dong', 'VND', '₫'),
('Rials', 'YER', '﷼'),
('Zimbabwe Dollars', 'ZWD', 'Z$'),
('Algerian dinar', 'DZD', 'DA'),
('Angolan kwanza', 'AOA', 'Kz'),
('Armenian dram', 'AMD', '֏'),
('Bahraini dinar', 'BHD', 'BD'),
('Bangladeshi taka', 'BDT', '৳'),
('West African CFA franc', 'XOF', 'CFA'),
('Burundian franc', 'BIF', 'FBu'),
('Central African CFA franc', 'XAF', 'FCFA'),
('Cape Verdean escudo', 'CVE', 'Esc'),
('Comorian franc', 'KMF', 'CF'),
('Djiboutian franc', 'DJF', 'Fdj'),
('Dominican peso', 'DOP', 'RD$'),
('Eritrean nakfa', 'ERN', 'Nkf'),
('Ethiopian birr', 'ETB', 'Br'),
('CFP franc', 'XPF', '₣'),
('Gambian dalasi', 'GMD', 'D'),
('Georgian lari', 'GEL', 'ლ'),
('Ghanaian cedi', 'GHS', 'GH₵'),
('Guinean franc', 'GNF', 'FG'),
('Iraqi dinar', 'IQD', 'ع.د'),
('Jordanian dinar', 'JOD', 'د.ا'),
('Kenyan shilling', 'KES', 'Ksh'),
('Kuwaiti dinar', 'KWD', 'د.ك'),
('Libyan dinar', 'LYD', 'ل.د'),
('Macanese pataca', 'MOP', 'MOP$'),
('Malagasy ariary', 'MGA', 'Ar'),
('Malawian kwacha', 'MWK', 'MK'),
('Maldivian rufiyaa', 'MVR', 'Rf'),
('Mauritanian ouguiya', 'MRO', 'UM'),
('Moldovan leu', 'MDL', 'L'),
('Moroccan dirham', 'MAD', 'MAD'),
('Myanmar kyat', 'MMK', 'K'),
('Papua New Guinean kina', 'PGK', 'K'),
('Rwandan franc', 'RWF', 'R₣'),
('Samoan tālā', 'WST', 'WS$'),
('São Tomé and Príncipe dobra', 'STD', 'Db'),
('Sierra Leonean leone', 'SLL', 'Le'),
('South Sudanese pound', 'SSP', '£'),
('Sudanese pound', 'SDG', 'ج.س'),
('Swazi lilangeni', 'SZL', 'L'),
('Tajikistani somoni', 'TJS', 'ЅM'),
('Tanzanian shilling', 'TZS', 'TSh'),
('Tongan paʻanga', 'TOP', 'T$'),
('Tunisian dinar', 'TND', 'DT'),
('Turkmenistani manat', 'TMT', 'T'),
('Ugandan shilling', 'UGX', 'USh'),
('United Arab Emirates dirham', 'AED', 'د.إ'),
('Vanuatu vatu', 'VUV', 'VT'),
('Zambian kwacha', 'ZMW', 'ZK'),
('Zimbabwean dollar', 'ZWL', '$');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_config`
--

CREATE TABLE `global_config` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `global_config`
--

INSERT INTO `global_config` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'APPLICATION_NAME', 'it-plus', '2022-12-07 12:00:01', '2022-12-11 05:07:26'),
(2, 'PRIMARY_COLOR', '#341145', '2022-12-07 12:00:01', '2022-12-11 05:07:26'),
(3, 'PRIMARY_LOGO', 'PRIMARY_LOGO.png', '2022-12-07 12:00:01', '2022-12-07 12:00:01'),
(4, 'SECONDARY_LOGO', 'SECONDARY_LOGO.png', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(5, 'FAVICON', 'FAVICON.png', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(6, 'SIGNALING_URL', 'https://link.testat-app.com:9007', '2022-12-07 12:00:02', '2022-12-11 08:17:11'),
(7, 'DEFAULT_USERNAME', 'name', '2022-12-07 12:00:02', '2022-12-11 08:17:11'),
(8, 'COOKIE_CONSENT', 'enabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(9, 'LANDING_PAGE', 'enabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(10, 'GOOGLE_ANALYTICS_ID', 'null', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(11, 'SOCIAL_INVITATION', 'Hey, check out this amazing website, where you can host video meetings!', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(12, 'MODERATOR_RIGHTS', 'disabled', '2022-12-07 12:00:02', '2022-12-11 08:17:11'),
(13, 'AUTH_MODE', 'disabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(14, 'PAYMENT_MODE', 'disabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(15, 'REGISTRATION', 'disabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(16, 'VERIFY_USERS', 'disabled', '2022-12-07 12:00:02', '2022-12-12 08:38:10'),
(17, 'STRIPE_KEY', 'pk_test_example', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(18, 'STRIPE_SECRET', 'sk_test_example', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(19, 'STRIPE', '0', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(20, 'STRIPE_WH_SECRET', '', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(21, 'PAYPAL', '0', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(22, 'PAYPAL_MODE', 'sandbox', '2022-12-07 12:00:02', '2022-12-07 12:00:02'),
(23, 'PAYPAL_CLIENT_ID', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(24, 'PAYPAL_SECRET', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(25, 'PAYPAL_WEBHOOK_ID', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(26, 'END_URL', '/', '2022-12-07 12:00:03', '2022-12-11 08:17:11'),
(27, 'CUSTOM_JS', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(28, 'CUSTOM_CSS', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(29, 'CUSTOM_JS', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(30, 'CUSTOM_CSS', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(31, 'MAIL_MAILER', 'smtp', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(32, 'MAIL_HOST', 'localhost', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(33, 'MAIL_PORT', '1025', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(34, 'MAIL_USERNAME', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(35, 'MAIL_PASSWORD', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(36, 'MAIL_ENCRYPTION', '', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(37, 'MAIL_FROM_ADDRESS', 'admin@example.com', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(38, 'API_TOKEN', 'TI3UIUYKjhfsRn78aUyDwrwBAOEvUwW2WZhOqbuVRpQYaAvcWIn8HCVfF9e0', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(39, 'VERSION', '1.5.0', '2022-12-07 12:00:03', '2022-12-07 12:00:03');

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direction` enum('ltr','rtl') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ltr',
  `default` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `code`, `name`, `direction`, `default`, `status`, `created_at`, `updated_at`) VALUES
(1, 'en', 'English', 'ltr', 'yes', 'active', '2022-12-07 12:00:03', '2022-12-07 12:00:03'),
(2, 'es', 'Spanish', 'ltr', 'no', 'active', '2022-12-07 12:00:03', '2022-12-07 12:00:03');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `meeting_id` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invites` text COLLATE utf8mb4_unicode_ci,
  `user_id` int(11) NOT NULL,
  `password` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `timezone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `meeting_id`, `title`, `description`, `invites`, `user_id`, `password`, `status`, `date`, `time`, `timezone`, `created_at`, `updated_at`) VALUES
(1, '27ukiir8k', 'Meeting 4:01 PM', NULL, NULL, 2, NULL, 'active', NULL, NULL, NULL, '2022-12-07 12:01:56', '2022-12-11 11:58:07'),
(2, 'updenjc10', 'abdullah', NULL, NULL, 2, NULL, 'active', NULL, NULL, NULL, '2022-12-07 12:02:20', '2022-12-07 12:02:20'),
(3, 'dvupoz6bi', 'test', NULL, NULL, 1, NULL, 'active', NULL, NULL, NULL, '2022-12-07 12:06:45', '2022-12-07 12:06:45'),
(4, 'qr1n1vnuw', 'Meeting 9:49 AM', NULL, NULL, 3, NULL, 'active', NULL, NULL, NULL, '2022-12-08 05:49:20', '2022-12-11 11:58:13'),
(5, 'it-plus', 'It-Plus Meeting', NULL, NULL, 1, NULL, 'active', NULL, NULL, NULL, '2022-12-08 08:48:51', '2022-12-12 08:47:01'),
(6, '6hamoya5t', 'Meeting 3:42 PM', NULL, NULL, 1, NULL, 'active', NULL, NULL, NULL, '2022-12-08 11:42:28', '2022-12-08 11:42:28');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2021_06_15_085952_create_meetings_table', 1),
(5, '2021_06_15_091451_create_global_config_table', 1),
(6, '2021_07_05_102827_create_currency_table', 1),
(7, '2021_11_08_091947_create_languages_table', 1),
(8, '2022_02_08_033129_create_coupons_table', 1),
(9, '2022_02_08_033248_create_plans_table', 1),
(10, '2022_02_08_033410_create_tax_rates_table', 1),
(11, '2022_02_12_103045_add_column_to_users', 1),
(12, '2022_02_12_124901_create_payments_table', 1),
(13, '2022_05_31_071047_create_pages_table', 1),
(14, '2022_06_01_100632_add_column_to_meetings', 1),
(15, '2022_10_13_112455_add_api_token_user', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `footer` enum('yes','no') COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `content` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `title`, `slug`, `footer`, `content`, `created_at`, `updated_at`) VALUES
(1, 'Home', 'home', 'no', 'Host your own video conferencing solution!', NULL, NULL),
(2, 'Privacy Policy', 'privacy-policy', 'yes', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', NULL, NULL),
(3, 'Terms & Conditions', 'terms-and-conditions', 'yes', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', NULL, NULL),
(4, 'Thank You', 'thank-you', 'no', 'Thank you for participating in the meeting!', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `plan_id` int(10) UNSIGNED NOT NULL,
  `payment_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gateway` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currency` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interval` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product` text COLLATE utf8mb4_unicode_ci,
  `coupon` text COLLATE utf8mb4_unicode_ci,
  `tax_rates` text COLLATE utf8mb4_unicode_ci,
  `seller` text COLLATE utf8mb4_unicode_ci,
  `customer` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `currency` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `decimals` tinyint(4) DEFAULT NULL,
  `amount_month` double(8,2) DEFAULT NULL,
  `amount_year` double(8,2) DEFAULT NULL,
  `coupons` text COLLATE utf8mb4_unicode_ci,
  `tax_rates` text COLLATE utf8mb4_unicode_ci,
  `visibility` tinyint(4) DEFAULT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `color` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `description`, `currency`, `decimals`, `amount_month`, `amount_year`, `coupons`, `tax_rates`, `visibility`, `features`, `color`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Default', 'This is the default plan.', '', NULL, 0.00, 0.00, NULL, NULL, NULL, '{\"text_chat\":\"1\",\"file_share\":\"1\",\"screen_share\":\"1\",\"whiteboard\":\"1\",\"hand_raise\":\"1\",\"meeting_no\":\"9000\",\"time_limit\":\"240\",\"recording\":\"1\"}', NULL, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tax_rates`
--

CREATE TABLE `tax_rates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` tinyint(1) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `regions` text COLLATE utf8mb4_unicode_ci,
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('end-user','admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_id` int(10) UNSIGNED NOT NULL DEFAULT '1',
  `plan_amount` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_currency` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_interval` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_payment_gateway` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_subscription_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_subscription_status` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan_created_at` timestamp NULL DEFAULT NULL,
  `plan_recurring_at` timestamp NULL DEFAULT NULL,
  `plan_trial_ends_at` timestamp NULL DEFAULT NULL,
  `plan_ends_at` timestamp NULL DEFAULT NULL,
  `billing_information` text COLLATE utf8mb4_unicode_ci,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `default_stats` smallint(6) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `email_verified_at`, `password`, `status`, `role`, `api_token`, `plan_id`, `plan_amount`, `plan_currency`, `plan_interval`, `plan_payment_gateway`, `plan_subscription_id`, `plan_subscription_status`, `plan_created_at`, `plan_recurring_at`, `plan_trial_ends_at`, `plan_ends_at`, `billing_information`, `remember_token`, `created_at`, `updated_at`, `default_stats`) VALUES
(1, 'admin', 'admin@it-plus.co', NULL, '$2y$10$J0yjrXLKTb4qCTSY3iv.a.sa7t0ImMWNsTsRBIaw89cDqXeBmpqYq', 'active', 'admin', 'WOmya7lsUMIGBH2ysxeTfWBXTYzUmp5ut7kgE58iwcPKbnFhDbsD9KDzwEbk', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '06G72aObRumfrMKJHBMBoMD0yeTFkwAol9A8yv3uUHr6YG4XV2fpiBDkaS7t', '2022-12-07 12:00:01', '2022-12-08 12:11:09', 1),
(2, 'abdullah', 'abdullah@it-plus.co', NULL, '$2y$10$LijsrFh6iJDan0lgq3Q4SuDicVKm4fMKCEVCAEPV.Ezay32nqStT6', 'active', 'end-user', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-12-07 12:01:52', '2022-12-07 12:01:52', 1),
(3, 'ashraf', 'ashraf7amdy@yahoo.com', NULL, '$2y$10$AhPPbi3CTBwIjZd099Uvn.pgzUDpj4rp/vxbNgsMgT5WUtiXOsU7C', 'active', 'end-user', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-12-08 05:49:06', '2022-12-08 05:49:06', 1),
(4, 'hussein', 'husseinmahmoud474@gmail.com', NULL, '$2y$10$R89q82AOZUEemmkzTIABQuEoWeGnGy00Y2tkpemTRAV7yQre8wy7e', 'active', 'end-user', NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-12-08 05:49:51', '2022-12-08 05:49:51', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `code` (`code`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `global_config`
--
ALTER TABLE `global_config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `languages_code_unique` (`code`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `gateway` (`gateway`),
  ADD KEY `interval` (`interval`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax_rates`
--
ALTER TABLE `tax_rates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_api_token_unique` (`api_token`),
  ADD KEY `plan_id` (`plan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_config`
--
ALTER TABLE `global_config`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tax_rates`
--
ALTER TABLE `tax_rates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
