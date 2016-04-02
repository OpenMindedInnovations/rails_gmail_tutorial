class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.string :item
      t.boolean :checked
      t.text :description

      t.timestamps null: false
    end
  end
end
