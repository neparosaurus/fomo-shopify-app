<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240928004131 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE configuration ADD text_content VARCHAR(255) NOT NULL, DROP corner_style, DROP hide_time_in_orders, DROP show_thumbnail, DROP thumbnail_position, DROP thumbnail_size, DROP hide_location_in_orders, DROP show_thumbnail_padding');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE configuration ADD corner_style VARCHAR(7) NOT NULL, ADD hide_time_in_orders TINYINT(1) NOT NULL, ADD show_thumbnail TINYINT(1) NOT NULL, ADD thumbnail_position VARCHAR(5) DEFAULT NULL, ADD thumbnail_size VARCHAR(4) NOT NULL, ADD hide_location_in_orders TINYINT(1) NOT NULL, ADD show_thumbnail_padding TINYINT(1) NOT NULL, DROP text_content');
    }
}
