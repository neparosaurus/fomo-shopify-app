import '@shopify/polaris/build/esm/styles.css';
import React, {useState, useCallback, useEffect} from 'react';
import {SaveBar, useAppBridge} from '@shopify/app-bridge-react';
import {
    AppProvider,
    Page,
    Card,
    Button,
    Select,
    ColorPicker,
    Text,
    RangeSlider,
    RadioButton,
    hsbToHex,
    AlphaPicker,
    PageActions,
    BlockStack,
    InlineStack,
    Layout,
    Label,
    TextField,
    Form,
    Checkbox,
    Grid,
    Divider,
    Badge
} from '@shopify/polaris';
import {saveConfiguration} from "../components/ApiService";
import thumbnail_1 from '../images/beauty-&-health.gif';
import thumbnail_2 from '../images/dress.gif';
import thumbnail_3 from '../images/electronic.gif';
import thumbnail_4 from '../images/product-2.gif';
import thumbnail_5 from '../images/shoes.gif';
import thumbnail_6 from '../images/untitled-2.gif';

const thumbnails = [thumbnail_1, thumbnail_2, thumbnail_3, thumbnail_4, thumbnail_5, thumbnail_6];
const randomThumbnailIndex = Math.floor(Math.random() * thumbnails.length);
const thumbnail = thumbnails[randomThumbnailIndex];
const previewImage = 'data:image/svg+xml,%3Csvg class=\'placeholder-svg\' preserveAspectRatio=\'xMaxYMid slice\' viewBox=\'0 0 1300 730\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg clip-path=\'url(%23clip0_779_1238)\'%3E%3Cpath d=\'M1300 410H0v320h1300V410Z\' fill=\'%235BA7B1\'%3E%3C/path%3E%3Cpath d=\'M1300 0H0v410h1300V0Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'M474 410c28.51-39.81 73.78-89.8 142-120 113.63-50.31 194.66-3.1 266-52 41.04-28.12 81.7-89.98 80-238h338v410H474Z\' fill=\'%23EDAB8E\'%3E%3C/path%3E%3Cpath d=\'M1174 0c-4.57 45.64-17.01 110.48-52 180-69.25 137.58-182.37 205.13-230 230h408V0h-126Z\' fill=\'%23EA9A81\'%3E%3C/path%3E%3Cpath d=\'M126 410c124.14 0 213.59-14.83 242-66 38.93-70.13-74.2-158.33-34-262 15.92-41.06 49.03-66.82 74-82H0v410h126Z\' fill=\'%23EDAB8E\'%3E%3C/path%3E%3Cpath d=\'M126 410c-68.88-117.13-69.26-250.08-2-334 36.03-44.96 83.52-65.93 116-76H0v410h126Z\' fill=\'%23EA9A81\'%3E%3C/path%3E%3Cpath d=\'M442 410h88c-3.51-10.52-7.01-21.04-10.52-31.56-1.16-3.48-6.05-3.57-7.34-.14-1.42 3.8-2.85 7.6-4.27 11.39-1.29 3.44-6.18 3.35-7.34-.14l-7.65-22.96c-1.08-3.25-5.52-3.62-7.13-.6-2.61 4.89-5.22 9.79-7.83 14.68-1.55 2.91-5.79 2.69-7.04-.36-3.69-9.02-7.38-18.03-11.06-27.05-1.35-3.29-6.03-3.21-7.26.13l-10.53 28.59v28l-.03.02Z\' fill=\'%23108060\'%3E%3C/path%3E%3Cpath d=\'M1300 224H758.35c-2.89 0-3.07-4.27-.19-4.51l75.83-6.32A92.708 92.708 0 0 0 896.78 181l30.62-35.85c14.34-16.79 39.96-17.8 55.57-2.18l12.34 12.34c21.76 21.76 57.58 19.93 77-3.95l34.73-42.7c25.81-31.73 74.62-30.56 98.88 2.36 19.11 25.93 56.68 29.09 79.85 6.72l14.24-13.75v120l-.01.01Z\' fill=\'%23F7E1D5\'%3E%3C/path%3E%3Cpath d=\'M220.89 256h405.42c2.16 0 2.3-3.2.14-3.38l-56.76-4.73a69.338 69.338 0 0 1-46.99-24.08l-22.92-26.83c-10.74-12.57-29.91-13.32-41.6-1.63l-9.24 9.24c-16.29 16.29-43.1 14.91-57.63-2.96l-25.99-31.96c-19.32-23.75-55.85-22.87-74.01 1.77L264.3 208.1 212 222.22l8.89 33.78Z\' fill=\'%23EAD1C1\'%3E%3C/path%3E%3Cpath d=\'m980 410 73.94-92.43a55.18 55.18 0 0 1 35.49-20.18l33.63-4.67a55.168 55.168 0 0 0 37.31-22.58l35.94-50.31c8.42-11.79 25.37-13.3 35.75-3.19l67.94 66.24V410H980Z\' fill=\'%239FA5AB\'%3E%3C/path%3E%3Cpath opacity=\'.3\' d=\'M1214.49 209.95c-6.95.32-13.75 3.67-18.18 9.87l-35.94 50.31a55.168 55.168 0 0 1-37.31 22.58l-33.63 4.67a55.132 55.132 0 0 0-35.49 20.18L980 409.99h178l58.33-104.66c5.57-9.99 3.05-22.54-5.95-29.61a23.25 23.25 0 0 1-7.94-24.85l12.04-40.94.01.02Z\' fill=\'%23D2D5D9\'%3E%3C/path%3E%3Cpath d=\'m464 410-46.64-91.42a12.72 12.72 0 0 0-10.74-6.92l-55.29-2.51c-15.35-.7-28.79-10.52-34.11-24.93l-30.7-83.14c-5.19-14.05-18.11-23.78-33.05-24.87l-33.65-2.46a38.223 38.223 0 0 1-32.69-23.92l-12.8-31.99a6.86 6.86 0 0 0-8.35-4.02L0 164v246s.06.02.09 0H464Z\' fill=\'%23818990\'%3E%3C/path%3E%3Cpath d=\'m96 410 6-66 21-56c1.03-2.73 4.9-2.71 5.89.04l12.38 34.4c.97 2.69 4.74 2.79 5.84.15l9.65-22.91c1.12-2.67 4.95-2.52 5.87.23l12.46 37.38c.95 2.84 4.95 2.87 5.94.04l7.24-20.67c1.05-3 5.39-2.72 6.03.4l6.24 29.93c.56 2.68 4.04 3.41 5.63 1.18l12.31-17.24c1.48-2.07 4.68-1.61 5.52.79l10.63 30.55c1.02 2.93 5.21 2.76 6-.23l4.5-17.11c.81-3.08 5.16-3.13 6.05-.08l8.73 29.92c.78 2.68 4.4 3.08 5.76.65l12.7-22.86c1.35-2.44 4.97-2.03 5.76.65l9.5 32.56c.82 2.81 4.69 3.07 5.88.4l8.75-19.69c1.22-2.74 5.22-2.37 5.92.55l6.1 25.6c.65 2.72 4.26 3.3 5.72.92l8.26-13.42c1.44-2.33 4.96-1.83 5.7.8l8.07 29.07H96Z\' fill=\'%2302614E\'%3E%3C/path%3E%3Cpath d=\'M0 410h218l-9.65-26.54a39.431 39.431 0 0 0-23.85-23.68l-51.05-18.15a39.436 39.436 0 0 1-25.57-30.02L102 279.66a39.44 39.44 0 0 0-24.53-29.63L0 220v190Z\' fill=\'%23686E72\'%3E%3C/path%3E%3Cpath d=\'M0 410h88c-3.73-11.18-7.46-22.37-11.18-33.55-.94-2.82-4.9-2.89-5.95-.11-1.91 5.11-3.83 10.21-5.74 15.32-1.04 2.78-5.01 2.71-5.95-.11l-8.86-26.59c-.88-2.63-4.47-2.93-5.78-.49-3.13 5.87-6.26 11.73-9.39 17.6-1.26 2.36-4.69 2.18-5.7-.29-4.13-10.09-8.26-20.18-12.38-30.27-1.09-2.66-4.88-2.6-5.88.1C7.46 361.74 3.73 371.87 0 381.99V410Z\' fill=\'%2302614E\'%3E%3C/path%3E%3Cpath d=\'m636.01 410 36.48-43.78c14.28-17.14 37.37-24.17 58.78-17.92l59.17 17.3c21.57 6.3 44.82-.88 59.06-18.26l53.45-65.19c3.24-3.95 7.88-6.51 12.95-7.15l16.59-2.07a51.1 51.1 0 0 1 40.94 13.11L1108 409.99H636l.01.01Z\' fill=\'%23818990\'%3E%3C/path%3E%3Cpath d=\'m1279.24 295.49-12.18 41.97c-.91 3.13-5.33 3.17-6.29.05l-9.05-29.41c-1-3.24-5.64-3.03-6.35.28l-9.35 44.07c-.65 3.08-4.84 3.56-6.18.72l-7.92-16.84c-1.31-2.79-5.41-2.39-6.15.6l-5.64 22.58c-.74 2.94-4.73 3.4-6.11.7l-15.16-29.66c-1.36-2.67-5.3-2.26-6.09.63l-7.07 25.92c-.84 3.08-5.14 3.27-6.25.27l-6.49-17.62c-1.14-3.1-5.62-2.76-6.29.47l-6.46 31.11c-.66 3.18-5.05 3.57-6.26.55l-12.18-30.46c-1.18-2.96-5.46-2.67-6.23.42l-8.87 35.48c-.79 3.16-5.21 3.36-6.28.28l-8.77-25.21c-1.07-3.08-5.49-2.88-6.28.28l-6.1 24.4c-.77 3.09-5.05 3.38-6.23.42l-7.67-19.18c-1.14-2.84-5.19-2.72-6.16.18l-10.21 30.62c-.98 2.94-5.12 3.01-6.19.1l-7.89-21.41c-1.03-2.79-4.95-2.88-6.1-.14l-9.33 22.17c-1.18 2.81-5.22 2.63-6.15-.27l-12.04-37.45c-.99-3.07-5.35-3.02-6.27.07l-10.43 35.2c-.87 2.93-4.93 3.19-6.15.38l-7.13-16.3c-1.18-2.71-5.06-2.59-6.09.18l-7.76 21.07c-1.09 2.96-5.33 2.83-6.23-.2-3.37-11.38-6.74-22.76-10.12-34.15-.92-3.11-5.32-3.14-6.28-.04-3.9 12.55-7.79 25.1-11.69 37.65-.95 3.07-5.3 3.08-6.26.02l-6.47-20.48c-.88-2.78-4.68-3.12-6.04-.53l-18.34 35.01h404v-76l-14.53-38.75c-1.11-2.96-5.34-2.8-6.22.24l-.02.01Z\' fill=\'%2302614E\'%3E%3C/path%3E%3Cpath d=\'M576 186c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64-35.346 0-64 28.654-64 64 0 35.346 28.654 64 64 64Z\' fill=\'%23EAD1C1\'%3E%3C/path%3E%3Cpath d=\'M576 170c26.51 0 48-21.49 48-48s-21.49-48-48-48-48 21.49-48 48 21.49 48 48 48Z\' fill=\'%23fff\'%3E%3C/path%3E%3Cpath d=\'m264.3 269.34 4.38 12.32c11.72 32.97 41.95 55.78 76.87 58.01a87.466 87.466 0 0 0 63.73-21.95l4.15-3.69a12.71 12.71 0 0 0-6.82-2.37l-55.29-2.51c-15.35-.7-28.79-10.52-34.11-24.93l-30.7-83.14c-5.19-14.05-18.11-23.78-33.05-24.87l-33.65-2.46a38.223 38.223 0 0 1-32.69-23.92l-12.8-31.99a6.822 6.822 0 0 0-3.17-3.51l-10.98 32.29c-11.16 32.84 6.32 68.52 39.11 79.83l33.29 11.48a51.472 51.472 0 0 1 31.72 31.41h.01Z\' fill=\'%239FA5AB\'%3E%3C/path%3E%3Cpath d=\'M51.84 244.38a39.431 39.431 0 0 1 16.74 34.63l-1.91 32.43a39.42 39.42 0 0 0 17.67 35.25l45.23 29.81a39.47 39.47 0 0 1 17.51 28.69l.52 4.8h70.52l-9.65-26.54a39.431 39.431 0 0 0-23.85-23.68l-51.05-18.15A39.436 39.436 0 0 1 108 311.6l-5.89-31.95a39.44 39.44 0 0 0-24.53-29.63L38 234.67l13.84 9.7v.01Z\' fill=\'%23818990\'%3E%3C/path%3E%3Cpath d=\'m756.08 443.99.04.01-.04-.01Z\' fill=\'%23686E72\'%3E%3C/path%3E%3Cpath opacity=\'.8\' d=\'m790.66 365.67 39.39 11.51c21.9 6.4 45.55.69 62.12-14.99a64.199 64.199 0 0 0 19.25-56.93l-4.38-26.98a19.967 19.967 0 0 0-4.21 3.85l-53.45 65.19a56.03 56.03 0 0 1-58.71 18.35h-.01ZM706 388c-.24-15.7 16.55-32.5 41.81-34.86l-16.54-4.84c-21.41-6.26-44.5.78-58.78 17.92L636.01 410H718c-3.29-2.83-11.83-10.97-12-22Z\' fill=\'%239FA5AB\'%3E%3C/path%3E%3Cpath d=\'M416.96 410a27.009 27.009 0 0 0 17.23 10.44l74.31 12.16c4.49.73 4.13 7.3-.41 7.54l-90.19 4.96c-4.91.27-4.9 7.51.01 7.77l95.5 4.97c4.71.25 5.01 7.08.34 7.74l-77.82 10.96c-4.62.65-4.39 7.4.27 7.73L558.37 493c6.93.49 7.28 10.54.41 11.52l-26.87 3.84c-4.68.67-4.34 7.53.38 7.74l118.58 5.33c4.61.21 5.09 6.85.55 7.71l-30.86 5.88c-4.44.85-4.11 7.31.39 7.7l41.36 3.57c37.51 3.23 75.27 1.58 112.35-4.93l42.85-7.52c4.39-.77 4.25-7.11-.17-7.69l-88.29-11.52c-4.63-.6-4.47-7.35.18-7.74l70.24-5.77c4.8-.39 4.75-7.44-.06-7.76l-63.91-4.32c-4.75-.32-4.88-7.25-.15-7.75l112.28-11.82c4.77-.5 4.58-7.51-.2-7.76l-91.17-4.75c-6.25-.33-6.45-9.48-.22-10.08l30.04-2.91c4.65-.45 4.7-7.22.06-7.74l-52.89-5.97c-4.63-.52-4.44-7.31.22-7.57l58.3-3.24c9.03-.5 17.68-3.81 24.74-9.46H416.94l.02.01Z\' fill=\'%2363B5B1\'%3E%3C/path%3E%3Cpath d=\'M0 478c15.69 2.92 39.93 5.53 68 0 42.62-8.4 48.21-26.53 84-34 45.2-9.43 57.35 15.07 114 14 9.94-.19 18.2-1.11 25.64-2.55 36.52-7.09 62.17-18.56 68.36-21.45 22.81-10.63 66.5-17.19 157.8-.42 67.4-3.19 134.8-6.39 202.2-9.58 6.3-.79 18.55-2.14 33.98-2.49 57.4-1.32 91.51 12.68 158.02 16.49 17.53 1 29.44.78 43.36-1.93 24.93-4.85 34.21-15.04 78.64-12.07 71.18 4.75 89.94 33.73 158 38 45.51 2.86 83.37-7.2 108-16v-36H0v68Z\' fill=\'%2363B5B1\'%3E%3C/path%3E%3Cpath opacity=\'.5\' d=\'m425.74 101.25 12.14 6.54a6.7 6.7 0 0 0 6.98-.39l10.76-7.46c1.24-.86.32-2.8-1.13-2.37l-10.43 3.05c-2.24.65-4.6.76-6.89.32l-10.59-2.06c-1.44-.28-2.14 1.69-.85 2.38l.01-.01ZM729.78 162.53l11.66 7.35a6.686 6.686 0 0 0 6.99.09l11.25-6.7c1.3-.77.51-2.77-.97-2.44l-10.61 2.32c-2.28.5-4.64.45-6.89-.15l-10.42-2.78c-1.42-.38-2.25 1.54-1.01 2.32v-.01Z\' fill=\'%23964F48\'%3E%3C/path%3E%3Cpath opacity=\'.75\' d=\'m656.07 194.86 16.65 2.66a8.18 8.18 0 0 0 7.91-3.26l9.43-12.95c1.09-1.49-.76-3.36-2.26-2.28l-10.82 7.72a17.873 17.873 0 0 1-7.83 3.14l-13.06 1.89c-1.78.26-1.79 2.81-.02 3.09v-.01Z\' fill=\'%23964F48\'%3E%3C/path%3E%3Cpath d=\'m695.71 113.63 12.93 12.86a8.834 8.834 0 0 0 9 2.13l16.46-5.4c1.9-.62 1.46-3.42-.54-3.43l-14.37-.06c-3.08-.01-6.12-.77-8.85-2.19l-12.65-6.6c-1.72-.9-3.35 1.33-1.98 2.7v-.01Z\' fill=\'%23964F48\'%3E%3C/path%3E%3Cpath d=\'M894.938 386.359c-13.528-2.239-26.508 6.204-29.834 19.39l-4.757 17.749a44.424 44.424 0 0 0 0 21.713c2.119 8.43 8.757 15.009 17.26 17.109 5.908 1.461 9.304 7.609 7.381 13.326L877.172 499h37.145L920 420.202l-25.076-33.857.014.014Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'m911 466 7.311 29.252L920.224 506h6.612L929 466h-18Z\' fill=\'%23EA9A81\'%3E%3C/path%3E%3Cpath d=\'m865.215 624.829-52.827-51.996c-9.913-9.757-23.901-14.346-37.776-12.39-17.18 2.412-31.364 14.429-36.348 30.788l-11.005 36.107c-1.162 3.817 1.736 7.662 5.796 7.662h127.89c5.39 0 8.079-6.408 4.27-10.157v-.014Z\' fill=\'%232E5157\'%3E%3C/path%3E%3Cpath d=\'m744.04 632.85 10.992-36.111c4.979-16.36 19.145-28.379 36.305-30.791a44.677 44.677 0 0 1 11.663-.096 45.066 45.066 0 0 0-28.445-5.417c-17.159 2.412-31.326 14.431-36.305 30.791l-10.992 36.111c-1.16 3.818 1.735 7.663 5.79 7.663h10.754a6.013 6.013 0 0 1 .238-2.15Z\' fill=\'%233C7980\'%3E%3C/path%3E%3Cpath d=\'M819.933 546c-1.406 3.619-2.617 7.307-3.55 11.063L797 635h29.492L857 572.915 819.947 546h-.014Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'M954.273 598.986a80.22 80.22 0 0 0 35.466-32.084l7.624-12.954c18.687-31.722 5.937-72.604-27.437-88.137-10.528-4.895-16.993-15.715-15.932-27.26l2.164-23.732c1.215-13.275-2.904-26.619-11.897-36.463-14.856-16.286-38.649-19.911-57.472-9.467l-14.075 7.808c-7.386 4.099-10.612 12.995-7.582 20.86l10.515 27.315a107.614 107.614 0 0 0 52.375 57.601c19.256 9.621 25.469 34.078 13.112 51.689l-19.688 28.083L954.259 599l.014-.014Z\' fill=\'%236E3A35\'%3E%3C/path%3E%3Cpath opacity=\'.75\' d=\'m938.181 562.986 19.499-27.951c12.225-17.529 6.085-41.871-12.986-51.448-23.813-11.949-42.317-32.392-51.873-57.332l-10.413-27.188c-3.001-7.827.207-16.681 7.509-20.762l13.94-7.772c5.781-3.22 12.031-5.065 18.351-5.634-11.685-3.442-24.533-2.249-35.637 3.941l-13.94 7.772c-7.316 4.08-10.51 12.935-7.509 20.762l10.413 27.188c9.556 24.94 28.059 45.383 51.873 57.332 19.07 9.576 25.224 33.919 12.986 51.448l-19.5 27.951L938.181 563v-.014Z\' fill=\'%23AF5947\'%3E%3C/path%3E%3Cpath d=\'M973.436 592.368c-.621-16.691-4.045-32.654-9.993-47.368L934 574.442 951.167 635H975l-1.579-42.632h.015Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'M969 559.741c-1.419-5.037-3.082-9.964-5.059-14.741L934 574.442 951.457 635h15.665l-12.598-43.703c-2.408-8.359 0-17.322 6.307-23.526l8.155-8.016.014-.014Z\' fill=\'%23EA9A81\'%3E%3C/path%3E%3Cpath d=\'M945.231 561.25 962 543.979c-6.536-16.619-16.174-31.641-28.581-44.303-7.366-7.511-17.655-11.676-28.926-11.676h-18.002c-9.568 0-19.303 2.999-27.874 8.566-18.154 11.815-32.126 29.128-39.617 48.635l24.108 21.339c4.32 4.318 5.456 10.898 2.852 16.424L824.137 635h105.447l2.575-45.039c.596-10.398 5.29-20.714 13.072-28.725v.014Z\' fill=\'%2302614E\'%3E%3C/path%3E%3Cpath opacity=\'.25\' d=\'M962 543.948c-6.397-16.622-15.83-31.647-27.974-44.311-6.804-7.096-16.17-11.207-26.47-11.637l12.022 40.048a99.609 99.609 0 0 1 1.125 53.129L907 635h23.271l2.521-45.047c.583-10.401 5.178-20.718 12.795-28.731L962 543.948Z\' fill=\'%23142924\'%3E%3C/path%3E%3Cpath d=\'M863.006 501.368c4.692-5.373 10.126-9.885 15.994-13.368-6.919 1.213-13.739 3.892-19.93 7.953-18.361 12-32.493 29.585-40.07 49.397L834.35 559c4.314-20.94 14.16-41.035 28.656-57.618v-.014Z\' fill=\'%2300735C\'%3E%3C/path%3E%3Cpath d=\'M494 630.718v-51.341c0-9.728 7.693-17.945 18.007-19.234l144.139-17.973c9.282-1.15 18.229 3.63 21.867 11.695l37.366 82.95c2.467 5.488 2.104 11.738-.99 16.948l-18.578 31.262c-3.791 6.374-11.066 10.213-18.857 9.964l-145.714-4.698c-8.223-.263-15.498-5.044-18.55-12.181l-17.199-40.214a18.377 18.377 0 0 1-1.477-7.206l-.014.028Z\' fill=\'%23975D48\'%3E%3C/path%3E%3Cpath d=\'M471 632.718v-51.341c0-9.728 7.693-17.946 18.007-19.234l144.139-17.973c9.282-1.15 18.229 3.63 21.867 11.695l37.366 82.95c2.467 5.488 2.104 11.738-.99 16.948l-18.578 31.262c-3.791 6.375-11.066 10.213-18.857 9.964l-145.714-4.698c-8.223-.263-15.498-5.044-18.55-12.181l-17.199-40.214a18.376 18.376 0 0 1-1.477-7.205l-.014.027Z\' fill=\'%23BF8563\'%3E%3C/path%3E%3Cpath opacity=\'.5\' d=\'M557.941 687.156 541.061 556 517 559.089l16.664 129.508a6.902 6.902 0 0 0 2.899 4.807l18.113.596a6.439 6.439 0 0 0 1.639-1.358 7.008 7.008 0 0 0 1.626-5.472v-.014ZM636.059 691.273a6.993 6.993 0 0 0 6.569 5.351l11.133.376h.238c2.157 0 4.16-.961 5.49-2.647 1.331-1.686 1.821-3.846 1.317-5.922L626.662 545 602 548.079c.028.223.07.46.126.683l33.919 142.497.014.014Z\' fill=\'%23975D48\'%3E%3C/path%3E%3Cpath d=\'M530.223 558.016c-.468-3.43-3.489-6.016-7.021-6.016-.312 0-.624.014-.936.055l-11.106 1.439c-3.872.497-6.609 3.982-6.099 7.758l17.46 129.359c.454 3.36 3.305 5.891 6.794 6.002l11.347.387h.241a7.18 7.18 0 0 0 5.333-2.351 6.778 6.778 0 0 0 1.702-5.462l-17.701-131.185-.014.014ZM648.837 690.47l-33.746-144.113c-.743-3.159-3.495-5.357-6.686-5.357-.303 0-.606.014-.908.056l-10.524 1.419a6.902 6.902 0 0 0-4.76 2.95 7.061 7.061 0 0 0-1.032 5.552L624.5 693.281c.716 3.047 3.371 5.246 6.452 5.343l10.937.376h.234c2.119 0 4.086-.96 5.393-2.644a6.97 6.97 0 0 0 1.293-5.913l.028.027Z\' fill=\'%236D493C\'%3E%3C/path%3E%3Cpath d=\'m1137.25 392.823-26.98-23.175c-7.2-6.174-17.37-7.453-25.7-3.01-9.63 5.133-17 14.246-19.86 25.482l-.37 1.491a109.471 109.471 0 0 0-2.37 41.372c.61 4.515 2.69 8.691 5.92 11.841a19.422 19.422 0 0 0 10.87 5.358l10.65.717c4.08.802 6.57 5.035 5.34 9.071 0 0-1.85 6.089-3.45 11.335 9.59 3.796 19.46 5.695 29.33 5.695 9.21 0 18.42-1.688 27.37-4.978-4.93-5.949-8.17-15.315-7.51-21.84l4.9-38.011c1.04-8.058-2.03-16.102-8.12-21.348h-.02Z\' fill=\'%23975D48\'%3E%3C/path%3E%3Cpath opacity=\'.5\' d=\'M1131.49 470.042 1148 473c-4.98-5.792-8.26-14.926-7.59-21.265l4.95-37.013-6.6-10.722-11.98 45.078c-1.95 7.326-.18 15.117 4.73 20.951l-.02.013Z\' fill=\'%236D493C\'%3E%3C/path%3E%3Cpath d=\'m1161.96 402.99-1.18-25.362c-.87-13.77-11.14-25.419-24.75-27.027-3.17-.375-6.19-.194-8.75.61a20.941 20.941 0 0 1-17.26-2.163l-5.88-3.633a29.637 29.637 0 0 0-34.75 2.634l-.09.083c-4.16 3.842-6.73 9.125-7.23 14.797-.58 6.683 2.38 13.173 7.65 17.167 1.61 1.22 3.05 2.635 4.36 4.174 4.29 5.075 6.5 11.551 6.67 18.207.05 2.177-.06 4.119-.33 5.464l-.22 1.081c-.68 3.231 1.65 6.31 4.92 6.546.35.027.71 0 1.08-.07 1.77-.346 3.01-1.872 3.38-3.647 1.1-5.283 4.92-9.166 9.46-9.166 5.42 0 9.8 5.519 9.8 12.328 0 3.564-1.2 6.767-3.13 9.014-3.49 4.076-3.46 10.22-.15 14.449a18.682 18.682 0 0 0 6.31 5.158c2.54 1.29 5.35 1.886 8.19 1.983l12.66.375a18.64 18.64 0 0 0 15.57-7.585l5.41-7.378c.4-.554.8-1.109 1.17-1.678 5.15-7.737 7.45-17.042 7.09-26.361Z\' fill=\'%23142924\'%3E%3C/path%3E%3Cpath opacity=\'.25\' d=\'m1077.42 364.743.1-.081c10.97-8.995 20.24-10.145 32.47-2.854l6.57 3.923a24.105 24.105 0 0 0 19.29 2.34c8.85-2.705 15.65-2.056 24.15 1.366-3.43-10.064-12.34-17.801-23.47-19.072-3.19-.365-6.22-.189-8.8.595-5.84 1.772-12.17 1.001-17.38-2.11l-5.92-3.544c-11.02-6.574-25.12-5.546-35 2.57l-.08.081c-4.19 3.747-6.78 8.9-7.28 14.433-.57 6.452 2.34 12.714 7.53 16.61a24.355 24.355 0 0 1 7.84-14.257h-.02Z\' fill=\'%236B7177\'%3E%3C/path%3E%3Cpath d=\'M1217 571.844 1249.18 541l39.82 86.272-33.9 2.728-38.1-58.156ZM1056 584.222 1017.4 562a1983.872 1983.872 0 0 0-23.4 95.638c10.25 3.375 20.39 6.833 29.06 10.362l32.93-83.778h.01Z\' fill=\'%23975D48\'%3E%3C/path%3E%3Cpath d=\'M1072.4 481.732c-10.04 5.728-19.03 13.161-26.38 22.088-9.86 11.945-17.59 25.259-23.14 39.356-.23.559-.45 1.118-.66 1.677-2.44 6.231-4.63 10.506-6.22 16.989l21.32 15.409 25.26 3.647 5.59-10.66c.94 29.116-5.2 55.646-4.13 84.762a2012.614 2012.614 0 0 1 160.89-.489c-5.34-33.475-14.87-64.406-21.41-97.839 3.65 4.764 5.87 10.716 9.44 15.494 7.25-.307 14.51-.573 21.76-.796 4.69-7.545 14.45-18.791 19.28-26.308-3.98-6.077-8.01-12.126-12.11-18.176-14.09-18.986-32.73-34.927-54.82-46.691L1158.58 473a92.251 92.251 0 0 1-8.45 4.596c-11.71 5.631-24.18 8.662-36.77 8.872-13.42.21-23.58-1.649-35.83-7.684l-5.14 2.934.01.014Z\' fill=\'%23DE6A5A\'%3E%3C/path%3E%3Cpath opacity=\'.1\' d=\'M1068.87 495.403c.13-.111.25-.222.38-.319a567.35 567.35 0 0 1 3.56-3.133 84.583 84.583 0 0 1 10.19-7.624c-2.8-.957-5.55-2.093-8.25-3.327l-2.69 1.539c-9.98 5.683-18.91 13.058-26.22 21.916-9.8 11.852-17.49 25.063-23 39.05-.23.555-.45 1.109-.66 1.664-2.42 6.182-4.6 10.424-6.18 16.856l8.28 5.975c1.45-5.24 3.17-10.425 5.2-15.498.22-.569.44-1.137.68-1.691 8.29-20.78 21.24-39.868 38.74-55.394l-.03-.014Z\' fill=\'%23F7E1D5\'%3E%3C/path%3E%3Cpath d=\'M1241.86 527.309c-12.03-16.169-27.39-30.133-45.37-41.182-5.07-3.111-10.38-5.817-15.86-8.147l-18.69-7.98c-2.77 1.688-10.08 8.273-12.94 9.64l3.38 1.186c22.55 28.236 32.78 65.902 28.39 101.741L1172.64 649c10.58-.098 40.7-.112 51.29-.056-4.9-30.231-13.89-57.923-19.77-88.112 3.4 3.488 5.38 8.161 8.72 11.663 13.51-.572 30.99-11.342 38.17-22.488l2.95-4.576a1284.8 1284.8 0 0 0-12.13-18.15l-.01.028Z\' fill=\'%23CD5747\'%3E%3C/path%3E%3Cpath d=\'m1016.92 560.014-3.44 10.32a9.342 9.342 0 0 0 4.04 10.964c8.09 4.899 20.37 10.238 30.03 12.461 4.07.947 8.27-.961 10.32-4.57l5.13-8.989c-15.69-1.825-36.49-10.127-46.06-20.2l-.02.014Z\' fill=\'%23F7E1D5\'%3E%3C/path%3E%3Cpath d=\'M1252.85 546c-10.61 12.254-28.02 23.477-41.85 27.046 2.09 2.872 4.61 5.897 6.95 8.867 2.19 2.76 5.95 3.806 9.29 2.579 9.06-3.332 22.49-12.059 30.14-19.016 2.83-2.579 3.46-6.762 1.44-9.982a2476.29 2476.29 0 0 0-5.97-9.494Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'M1151.47 463.304a9.745 9.745 0 0 0-7.1.895c-9.8 5.395-20.34 8.334-30.94 8.519-6.92.113-13.83-.952-20.49-3.138a9.678 9.678 0 0 0-7.26.483l-7.99 6.02c-2.57 1.931-2.13 6.048.79 7.326 11.04 4.813 23.7 7.78 35.06 7.582 8.67-.142 18.38-2.088 27.36-5.225 6.1-2.13 11.8-5.381 16.9-9.499l3.7-2.996c2.4-1.931 1.82-5.835-1.02-6.928-3.03-1.164-6.53-2.428-9.01-3.053v.014Z\' fill=\'%23F7E1D5\'%3E%3C/path%3E%3Cpath d=\'m1063 639 11.11-8.488c9.33-17.356 11.3-40.094 9.03-61.118-.74-6.9-9.93-8.797-13.43-2.796l-1.71 2.923-5 69.479Z\' fill=\'%23CD5747\'%3E%3C/path%3E%3Cpath d=\'M1160.44 466.42c-3.09-1.186-6.66-2.473-9.18-3.11a9.973 9.973 0 0 0-7.25.911 70.47 70.47 0 0 1-13.01 5.569c8.12 1.75 15.11 5.497 20.34 11.21a60.322 60.322 0 0 0 6.36-4.484l3.77-3.052c2.44-1.967 1.86-5.945-1.04-7.059l.01.015Z\' fill=\'%23E8BE9E\'%3E%3C/path%3E%3Cpath d=\'M318.148 584.026 389.152 730H1300V612.215l-113.51 12.627a1077.374 1077.374 0 0 1-158.28 5.902L622.569 616.03a1076.718 1076.718 0 0 1-207.552-27.898l-84.334-19.823c-9.117-2.144-16.635 7.28-12.535 15.717Z\' fill=\'%23142924\'%3E%3C/path%3E%3Cpath opacity=\'.25\' d=\'M1186.49 624.842a1077.374 1077.374 0 0 1-158.28 5.902L622.569 616.03a1079.098 1079.098 0 0 1-173.044-20.394 1049.917 1049.917 0 0 1-34.508-7.504l-84.334-19.823c-9.117-2.144-16.635 7.28-12.535 15.717L389.152 730h126.889l-41.958-86.254c-5.907-12.139 4.267-25.948 17.567-23.819a1079.754 1079.754 0 0 0 130.919 12.808l405.641 14.714c52.84 1.921 105.74-.056 158.28-5.902L1300 628.92v-16.705l-113.51 12.627Z\' fill=\'%236B7177\'%3E%3C/path%3E%3C/g%3E%3Cdefs%3E%3CclipPath id=\'clip0_779_1238\'%3E%3Cpath fill=\'%23fff\' d=\'M0 0h1300v730H0z\'%3E%3C/path%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E';

const hsbToRgb = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
};

const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hsbaToHex = ({ hue, saturation, brightness, alpha } = {}) => {
    if (hue === undefined || saturation === undefined || brightness === undefined) {
        return '#000000'; // Default color if any property is missing
    }
    const [r, g, b] = hsbToRgb(hue, saturation * 100, brightness * 100);
    const hex = rgbToHex(r, g, b);

    if (alpha !== undefined) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return hex + alphaHex;
    }

    return hex;
};

const pluralize = (count, word) => {
    return count === 1 ? word : `${word}s`;
};

const loadFont = (fontName) => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};


function IndexPage({initialData}) {
    const shopify = useAppBridge();
    const marginBtm = '30px';
    const [data, setData] = useState(initialData);
    const [dataDynamic, setDataDynamic] = useState(initialData);
    const [isChanged, setIsChanged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [appEnabled, setAppEnabled] = useState(data.appEnabled);
    const [fontFamily, setFontFamily] = useState(data.fontFamily);
    const [fontSize, setFontSize] = useState(data.fontSize);
    const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor);
    const [textColor, setTextColor] = useState(data.textColor);
    const [initialDelay, setInitialDelay] = useState(data.initialDelay);
    const [delay, setDelay] = useState(data.delay);
    const [duration, setDuration] = useState(data.duration);
    const [cornerStyle, setCornerStyle] = useState(data.cornerStyle);
    const [position, setPosition] = useState(data.position);
    const [ordersLength, setOrdersLength] = useState(data.ordersLength);
    const [ordersShowingLength, setOrdersShowingLength] = useState(data.ordersShowingLength);
    const [thresholdType, setThresholdType] = useState(data.thresholdType);
    const [thresholdMinutes, setThresholdMinutes] = useState(data.thresholdMinutes);
    const [thresholdCount, setThresholdCount] = useState(data.thresholdCount);
    const [loopOrders, setLoopOrders] = useState(data.loopOrders);
    const [shuffleOrders, setShuffleOrders] = useState(data.shuffleOrders);
    const [hideTimeInOrders, setHideTimeInOrders] = useState(data.hideTimeInOrders);
    const [hideLocationInOrders, setHideLocationInOrders] = useState(data.hideLocationInOrders);
    const [showThumbnail, setShowThumbnail] = useState(data.showThumbnail);
    const [showThumbnailPadding, setShowThumbnailPadding] = useState(data.showThumbnailPadding);
    const [thumbnailPosition, setThumbnailPosition] = useState(data.thumbnailPosition);
    const [thumbnailSize, setThumbnailSize] = useState(data.thumbnailSize);

    const getThresholdValue = (minutes) => {
        if (minutes >= 1440) return minutes / 1440 + 83;    // Convert to days range 84-114
        if (minutes >= 60) return minutes / 60 + 59;        // Convert to hours range 60-83
        return minutes;                                     // Keep as minutes range 1-59
    };

    const getMinutesFromThresholdValue = (value) => {
        if (value >= 83) return (value - 82) * 1440;    // Convert from days
        if (value >= 60) return (value - 59) * 60;      // Convert from hours
        return value;                                   // Keep as minutes
    };

    const getUnitFromThresholdValue = (value) => {
        if (value >= 83) return 'days';
        if (value >= 60) return 'hours';
        return 'minutes';
    };

    const getUnitFromThresholdValuePlural = (value) => {
        if (value >= 83) return pluralize(value - 82, 'day');
        if (value >= 60) return pluralize(value - 59, 'hour');
        return pluralize(value, 'minute');
    };

    const [thresholdValue, setThresholdValue] = useState(getThresholdValue(data.thresholdMinutes));
    const [thresholdUnit, setThresholdUnit] = useState(getUnitFromThresholdValue(thresholdValue));
    const [displayedValue, setDisplayedValue] = useState(thresholdValue);

    const fontFamilyOptions = [
        {label: 'Theme\'s default', value: 'default'},
        {label: 'Roboto', value: 'Roboto'},
        {label: 'Open Sans', value: 'Open+Sans'},
        {label: 'Lato', value: 'Lato'},
        {label: 'Montserrat', value: 'Montserrat'},
        {label: 'Poppins', value: 'Poppins'},
        {label: 'Merriweather', value: 'Merriweather'},
        {label: 'Playfair Display', value: 'Playfair+Display'},
    ];

    const positionOptions = [
        {label: 'Top left', value: 'top-left'},
        {label: 'Top right', value: 'top-right'},
        {label: 'Bottom left', value: 'bottom-left'},
        {label: 'Bottom right', value: 'bottom-right'},
    ];

    const thumbnailPositionOptions = [
        {label: 'Left', value: 'left'},
        {label: 'Right', value: 'right'},
    ]

    const handleFontFamilyChange = useCallback(
        (value) => {
            setFontFamily(value);
            loadFont(value);
        },
        []
    );

    const handleFontSizeChange = useCallback(
        (value) => setFontSize(value.toString()),
        [],
    );

    const handleInitialDelayChange = useCallback(
        (value) => setInitialDelay(value),
        [],
    );

    const handleDelayChange = useCallback(
        (value) => setDelay(value),
        [],
    );

    const handleDurationChange = useCallback(
        (value) => setDuration(value),
        [],
    );

    const handleCornerStyleChange = (value) => {
        setCornerStyle(value);
    };

    const handlePositionChange = useCallback(
        (value) => setPosition(value),
        [],
    );

    const handleThumbnailPositionChange = useCallback(
        (value) => setThumbnailPosition(value),
        [],
    )

    const handleThresholdTypeChange = (value) => {
        setThresholdType(value);
    };

    const handleLoopOrdersChange = useCallback(
        (isChecked) => setLoopOrders(isChecked),
        [],
    );

    const handleShuffleOrdersChange = useCallback(
        (isChecked) => setShuffleOrders(isChecked),
        [],
    );

    const handleHideTimeInOrders = useCallback(
        (isChecked) => setHideTimeInOrders(isChecked),
        [],
    )

    const handleHideLocationInOrders = useCallback(
        (isChecked) => setHideLocationInOrders(isChecked),
        [],
    )

    const handleShowThumbnail = useCallback(
        (isChecked) => setShowThumbnail(isChecked),
        [],
    )

    const handleThumbnailSizeChange = useCallback(
        (value) => setThumbnailSize(value.toString()),
        [],
    );

    const handleThresholdValueChange = (value) => {
        setThresholdValue(value);
        setDisplayedValue(value);
        setThresholdUnit(getUnitFromThresholdValue(value));
        setThresholdMinutes(getMinutesFromThresholdValue(value));
    };

    const handleThresholdCountChange = useCallback(
        (value) => setThresholdCount(Number(value)),
        [],
    );

    const formatThresholdValue = (value, unit) => {
        const displayValue = value >= 83 ? value - 82 : value >= 60 ? value - 59 : value;
        return `${displayValue} ${unit}`;
    };

    const handleAppEnabled = () => {
        setAppEnabled((prevState) => !prevState);
    }

    const handleSave = async () => {
        setIsSaving(true);
        const response = await saveConfiguration(
            appEnabled,
            fontFamily,
            fontSize,
            backgroundColor,
            textColor,
            initialDelay,
            delay,
            duration,
            cornerStyle,
            position,
            thresholdType,
            thresholdMinutes,
            thresholdCount,
            loopOrders,
            shuffleOrders,
            hideTimeInOrders,
            hideLocationInOrders,
            showThumbnail,
            thumbnailPosition,
            thumbnailSize,
        );
        setIsSaving(false);

        if (response?.status === 200) {
            setDataDynamic({
                appEnabled,
                fontFamily,
                fontSize,
                backgroundColor,
                textColor,
                initialDelay,
                delay,
                duration,
                cornerStyle,
                position,
                thresholdType,
                thresholdMinutes,
                thresholdCount,
                loopOrders,
                shuffleOrders,
                hideTimeInOrders,
                hideLocationInOrders,
                showThumbnail,
                thumbnailPosition,
                thumbnailSize,
                ordersLength,
                ordersShowingLength,
            });
            setIsChanged(false);
            setData(dataDynamic);

            if (response.data.ordersLength) {
                setOrdersLength(response.data.ordersLength);
            }
            if (response.data.ordersShowingLength) {
                setOrdersShowingLength(response.data.ordersShowingLength);
            }

            shopify.saveBar.hide('save-bar');

            shopify.toast.show('Configuration updated', {
                duration: 5000,
            });
        }
        else {
            shopify.toast.show('Failed to update configuration', {
                duration: 5000,
                isError: true,
            });
        }
    }

    const handleDiscard = () => {
        setIsChanged(false);
        setData(dataDynamic);
        setAppEnabled(dataDynamic.appEnabled);
        setFontFamily(dataDynamic.fontFamily);
        setFontSize(dataDynamic.fontSize);
        setBackgroundColor(dataDynamic.backgroundColor);
        setTextColor(dataDynamic.textColor);
        setInitialDelay(dataDynamic.initialDelay);
        setDelay(dataDynamic.delay);
        setDuration(dataDynamic.duration);
        setCornerStyle(dataDynamic.cornerStyle);
        setPosition(dataDynamic.position);
        setThresholdType(dataDynamic.thresholdType);
        setThresholdMinutes(dataDynamic.thresholdMinutes);
        setThresholdCount(dataDynamic.thresholdCount);
        setLoopOrders(dataDynamic.loopOrders);
        setShuffleOrders(dataDynamic.shuffleOrders);
        setHideTimeInOrders(dataDynamic.hideTimeInOrders);
        setHideLocationInOrders(dataDynamic.hideLocationInOrders);
        setShowThumbnail(dataDynamic.showThumbnail);
        setThumbnailPosition(dataDynamic.thumbnailPosition);
        setThumbnailSize(dataDynamic.thumbnailSize);

        shopify.saveBar.hide('save-bar');
    };

    useEffect(() => {
        const checkIsChanged = () => {
            if (appEnabled !== dataDynamic.appEnabled ||
                fontFamily !== dataDynamic.fontFamily ||
                fontSize !== dataDynamic.fontSize ||
                backgroundColor !== dataDynamic.backgroundColor ||
                textColor !== dataDynamic.textColor ||
                initialDelay !== dataDynamic.initialDelay ||
                delay !== dataDynamic.delay ||
                duration !== dataDynamic.duration ||
                cornerStyle !== dataDynamic.cornerStyle ||
                position !== dataDynamic.position ||
                thresholdType !== dataDynamic.thresholdType ||
                thresholdMinutes !== dataDynamic.thresholdMinutes ||
                thresholdCount !== dataDynamic.thresholdCount ||
                loopOrders !== dataDynamic.loopOrders ||
                shuffleOrders !== dataDynamic.shuffleOrders ||
                hideTimeInOrders !== dataDynamic.hideTimeInOrders ||
                hideLocationInOrders !== dataDynamic.hideLocationInOrders ||
                showThumbnail !== dataDynamic.showThumbnail ||
                thumbnailPosition !== dataDynamic.thumbnailPosition ||
                thumbnailSize !== dataDynamic.thumbnailSize
            ) {
                setIsChanged(true);
                shopify.saveBar.show('save-bar');
            }
        };

        checkIsChanged();
    }, [
        appEnabled,
        fontFamily,
        fontSize,
        backgroundColor,
        textColor,
        initialDelay,
        delay,
        duration,
        cornerStyle,
        position,
        thresholdType,
        thresholdMinutes,
        thresholdCount,
        loopOrders,
        shuffleOrders,
        hideTimeInOrders,
        hideLocationInOrders,
        showThumbnail,
        thumbnailPosition,
        thumbnailSize,
        dataDynamic
    ]);

    useEffect(() => {
        if (fontFamily !== 'default') {
            loadFont(fontFamily);
        }
    }, [fontFamily]);


    return (
        <Page title="Notifications App Prototype">
            <Layout>
                <Layout.AnnotatedSection
                    title="General"
                >
                    <BlockStack gap="400">
                        <Card sectioned style={{marginBottom: marginBtm}}>
                            <BlockStack gap="400">
                                <InlineStack gap="100" direction="row" align="space-between">
                                    <Text as="h2" variant="bodyMd" style={{display: 'flex', alignItems: 'center'}}>
                                        The app is {appEnabled ? <Badge tone="success" style={{height: '100%', marginLeft: '5px'}}>enabled</Badge> : <Badge tone="info" style={{height: '100%'}}>disabled</Badge>}
                                    </Text>
                                    <Button onClick={handleAppEnabled}>{appEnabled ? 'Disable' : 'Enable'}</Button>
                                </InlineStack>
                            </BlockStack>
                        </Card>

                        <Grid style={{marginBottom: marginBtm}}>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <Card sectioned>
                                    <BlockStack gap="400">
                                        <InlineStack gap="100" direction="row" align="start">
                                            <Text as="h1" variant="heading3xl" fontWeight="regular">{ordersLength}</Text>
                                            <Text as="h2" variant="bodyMd">{pluralize(ordersLength, "order")} imported</Text>
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <Card sectioned>
                                    <BlockStack gap="400">
                                        <InlineStack gap="100" direction="row" align="start">
                                            <Text as="h1" variant="heading3xl" fontWeight="regular">{ordersShowingLength}</Text>
                                            <Text as="h2" variant="bodyMd">{pluralize(ordersShowingLength, "order")} currently showing</Text>
                                        </InlineStack>
                                    </BlockStack>
                                </Card>
                            </Grid.Cell>
                        </Grid>
                    </BlockStack>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Timing"
                    description="Control the flow of notifications by setting the loop option, initial delay, delay between notifications, and the duration each notification is displayed."
                >
                    <Card style={{marginBottom: marginBtm}}>
                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight="semibold" variant="headingSm" as="h6">
                                    Notifications repeat
                                </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Checkbox
                                    label="Loop notifications"
                                    checked={loopOrders === true}
                                    onChange={handleLoopOrdersChange}
                                    helpText={
                                        <Text as="p" variant="bodySm" tone="subdued" style={{marginTop: '8px'}}>
                                            When it comes to the end, show notifications from beginning.
                                        </Text>
                                    }
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Checkbox
                                    label="Shuffle order of notifications"
                                    checked={shuffleOrders === true}
                                    onChange={handleShuffleOrdersChange}
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Checkbox
                                    label="Hide time in notifications"
                                    checked={hideTimeInOrders === true}
                                    onChange={handleHideTimeInOrders}
                                    helpText={
                                        <Text as="p" variant="bodySm" tone="subdued" style={{marginTop: '8px'}}>
                                            If checked show "bought" instead of "seconds/minutes/hours/days ago"
                                        </Text>
                                    }
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Checkbox
                                    label="Hide location in notifications"
                                    checked={hideLocationInOrders === true}
                                    onChange={handleHideLocationInOrders}
                                    helpText={
                                        <Text as="p" variant="bodySm" tone="subdued" style={{marginTop: '8px'}}>
                                            If checked don't show "from"
                                        </Text>
                                    }
                                />
                            </div>
                        </div>

                        <div style={{marginBottom: '4px'}}>
                            <RangeSlider
                                output
                                label="Initial delay"
                                min={0}
                                max={60}
                                value={initialDelay}
                                onChange={handleInitialDelayChange}
                                suffix={
                                    <p
                                        style={{
                                            minWidth: '24px',
                                            width: '82px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {initialDelay} {pluralize(initialDelay, 'second')}
                                    </p>
                                }
                            />
                        </div>

                        <div style={{marginBottom: '4px'}}>
                            <RangeSlider
                                output
                                label="Delay"
                                min={0}
                                max={60}
                                value={delay}
                                onChange={handleDelayChange}
                                suffix={
                                    <p
                                        style={{
                                            minWidth: '24px',
                                            width: '82px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {delay} {pluralize(delay, 'second')}
                                    </p>
                                }
                            />
                        </div>

                        <div style={{marginBottom: '4px'}}>
                            <RangeSlider
                                output
                                label="Duration"
                                min={0}
                                max={60}
                                value={duration}
                                onChange={handleDurationChange}
                                suffix={
                                    <p
                                        style={{
                                            minWidth: '24px',
                                            width: '82px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {duration} {pluralize(duration, 'second')}
                                    </p>
                                }
                            />
                        </div>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Threshold"
                    description="Define limits with threshold settings, including selecting the type and specifying the threshold value."
                >
                    <Card>
                        <div style={{marginBottom: '20px'}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight="semibold" variant="headingSm" as="h6">
                                    Threshold type
                                </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <RadioButton
                                    label="Time limit"
                                    checked={thresholdType === 0}
                                    id="threshold_0"
                                    name="threshold type"
                                    value="0"
                                    onChange={() => handleThresholdTypeChange(0)}
                                />
                                <RadioButton
                                    label="Orders limit"
                                    checked={thresholdType === 1}
                                    id="threshold_1"
                                    name="threshold type"
                                    value="1"
                                    onChange={() => handleThresholdTypeChange(1)}
                                />
                            </div>
                        </div>

                        {thresholdType === 0 && (
                            <div style={{marginBottom: '4px'}}>
                                <RangeSlider
                                    output
                                    label={`Time (${thresholdUnit})`}
                                    min={1}
                                    max={114}
                                    value={thresholdValue}
                                    onChange={(value) => handleThresholdValueChange(Number(value))}
                                    onChangeEnd={(value) => setDisplayedValue(value)}
                                    suffix={
                                        <p
                                            style={{
                                                minWidth: '24px',
                                                width: '82px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {formatThresholdValue(displayedValue, getUnitFromThresholdValuePlural(thresholdValue))}
                                        </p>
                                    }
                                />
                            </div>
                        )}

                        {thresholdType === 1 && (
                            <div style={{marginBottom: '4px'}}>
                                <RangeSlider
                                    output
                                    label="Orders"
                                    min={1}
                                    max={60}
                                    value={thresholdCount}
                                    onChange={handleThresholdCountChange}
                                    suffix={
                                        <p
                                            style={{
                                                minWidth: '22px',
                                                width: '82px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {thresholdCount} {pluralize(thresholdCount, 'order')}
                                        </p>
                                    }
                                />
                            </div>
                        )}
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Appearance"
                    description="Customize the notification's look."
                >
                    <Card sectioned style={{marginBottom: marginBtm}}>
                        <Grid style={{marginBottom: marginBtm}}>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                <div style={{marginBottom: marginBtm}}>
                                    <Select
                                        options={fontFamilyOptions}
                                        onChange={handleFontFamilyChange}
                                        value={fontFamily}
                                        label="Font Family"
                                    />
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 0, sm: 0, md: 1, lg: 1, xl: 1}}></Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <div style={{marginBottom: marginBtm}}>
                                    <RangeSlider
                                        output
                                        label="Font size"
                                        min={50}
                                        max={200}
                                        step={5}
                                        value={fontSize}
                                        onChange={handleFontSizeChange}
                                        suffix={
                                            <p
                                                style={{
                                                    minWidth: '24px',
                                                    width: '38px',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                {fontSize}%
                                            </p>
                                        }
                                    />
                                </div>
                            </Grid.Cell>
                        </Grid>

                        <Grid style={{marginBottom: marginBtm}}>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <div style={{marginBottom: marginBtm}}>
                                    <div style={{marginBottom: '4px'}}>
                                        <Text fontWeight='regular' variant="headingSm" as="h6">
                                            Text Color
                                        </Text>
                                    </div>
                                    <ColorPicker onChange={setTextColor} color={textColor} allowAlpha/>
                                </div>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 6, lg: 6, xl: 6}}>
                                <div style={{marginBottom: marginBtm}}>
                                    <div style={{marginBottom: '4px'}}>
                                        <Text fontWeight='regular' variant="headingSm" as="h6">
                                            Background Color
                                        </Text>
                                    </div>
                                    <ColorPicker onChange={setBackgroundColor} color={backgroundColor} allowAlpha/>
                                </div>
                            </Grid.Cell>
                        </Grid>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight='regular' variant="headingSm" as="h6">
                                    Corners
                                </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <RadioButton
                                    label="Rounded"
                                    checked={cornerStyle === 'rounded'}
                                    id="corners-rounded"
                                    name="corners"
                                    value="rounded"
                                    onChange={() => handleCornerStyleChange('rounded')}
                                />
                                <RadioButton
                                    label="Sharp"
                                    checked={cornerStyle === 'sharp'}
                                    id="corners-sharp"
                                    name="corners"
                                    value="sharp"
                                    onChange={() => handleCornerStyleChange('sharp')}
                                />
                            </div>
                        </div>

                        <div style={{marginBottom: marginBtm}}>
                            <div style={{marginBottom: '4px'}}>
                                <Text fontWeight="regular" variant="headingSm" as="h6">
                                    Product thumbnail
                                </Text>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', marginBottom: '4px'}}>
                                <Checkbox
                                    label="Show thumbnail"
                                    checked={showThumbnail === true}
                                    onChange={handleShowThumbnail}
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', marginBottom: '4px'}}>
                                <RangeSlider
                                    output
                                    label="Thumbnail size"
                                    min={4}
                                    max={100}
                                    step={1}
                                    value={thumbnailSize}
                                    onChange={handleThumbnailSizeChange}
                                    disabled={showThumbnail === false}
                                    suffix={
                                        <p
                                            style={{
                                                minWidth: '24px',
                                                width: '38px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {thumbnailSize}px
                                        </p>
                                    }
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <Select
                                    options={thumbnailPositionOptions}
                                    onChange={handleThumbnailPositionChange}
                                    value={thumbnailPosition}
                                    label="Thumbnail position"
                                    disabled={showThumbnail === false}
                                />
                            </div>
                        </div>

                        <div style={{marginBottom: '4px'}}>
                            <Select
                                options={positionOptions}
                                onChange={handlePositionChange}
                                value={position}
                                label="Position"
                            />
                        </div>
                    </Card>
                </Layout.AnnotatedSection>

                <Layout.AnnotatedSection
                    title="Preview"
                    description="View a live preview of how the notifications will appear with the current settings."
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundImage: `url("${previewImage}")`,
                        backgroundSize: '100%',
                        height: '328px',
                        marginBottom: '100px',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                    }}>
                        <div style={{
                            backgroundColor: hsbaToHex(backgroundColor),
                            borderRadius: cornerStyle === 'rounded' ? '5px' : 0,
                            padding: '8px 12px',
                            lineHeight: '1.2em',
                            marginBottom: '5px',
                            ...(position === 'top-left' || position === 'bottom-left' ? {marginRight: 'auto'} : {marginLeft: 'auto'}),
                            ...(position === 'bottom-left' || position === 'bottom-right' ? {marginTop: 'auto'} : {marginTop: '0'}),
                            overflow: 'hidden',
                        }}>
                            {showThumbnail && thumbnailPosition === 'left' && (
                                <img style={{
                                    height: `${thumbnailSize}px`,
                                }}
                                     src={thumbnail}
                                />
                            )}
                            <p style={{
                                fontFamily: fontFamily === 'default' ? 'inherit' : fontFamily.replace(/\+/g, ' '),
                                margin: 0,
                                color: hsbaToHex(textColor),
                                fontSize: `${fontSize}%`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                            }}>
                                <span style={{fontWeight: '700'}}>Robert Bloggs</span> from
                                {!hideLocationInOrders ?? (<>
                                    <span style={{fontWeight: '700'}}>Barcelona</span> just bought a
                                </>)}
                                <a style={{fontWeight: '700', color: 'inherit'}} href="#">Super Soft Dog Toy</a>
                            </p>
                            {showThumbnail && thumbnailPosition === 'right' && (
                                <img style={{
                                    height: `${thumbnailSize}px`,
                                }}
                                     src={thumbnail}
                                />
                            )}
                        </div>
                    </div>
                </Layout.AnnotatedSection>
            </Layout>

            <SaveBar id="save-bar" discardConfirmation={true}>
                <button
                    variant="primary"
                    onClick={handleSave}
                    {...(isSaving && { loading: '' })}
                >
                    Save
                </button>
                {!isSaving && (
                    <button onClick={handleDiscard}>
                        Discard
                    </button>
                )}
            </SaveBar>
        </Page>
    );
}

export default IndexPage;