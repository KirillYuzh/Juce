import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

const DEFAULT_LABEL = 'Нажмите для загрузки или перетащите';

function fileInput() {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error('Поле выбора файла не найдено');
  return input;
}

function pick(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  fireEvent.change(input);
}

function drop(target: HTMLElement, files: File[]) {
  fireEvent.drop(target, { dataTransfer: { files } });
}

describe('FileUpload', () => {
  it('показывает фразу по умолчанию и форматы из accept', () => {
    render(<FileUpload accept=".pdf,.docx,.png" onFiles={() => {}} />);

    expect(screen.getByText(DEFAULT_LABEL)).toBeTruthy();
    expect(screen.getByText('PDF, DOCX, PNG')).toBeTruthy();
  });

  it('выводит «Любые файлы», когда accept не задан', () => {
    render(<FileUpload onFiles={() => {}} />);

    expect(screen.getByText('Любые файлы')).toBeTruthy();
  });

  it('переводит MIME-типы и дописывает maxSize к форматам', () => {
    render(
      <FileUpload
        accept="application/pdf,image/png,image/jpeg"
        maxSize={10 * 1024 * 1024}
        onFiles={() => {}}
      />
    );

    expect(screen.getByText('PDF, PNG, JPG · до 10 МБ')).toBeTruthy();
  });

  it('позволяет переопределить строку форматов', () => {
    render(<FileUpload accept=".pdf,.docx" formats="Только документы" onFiles={() => {}} />);

    expect(screen.getByText('Только документы')).toBeTruthy();
    expect(screen.queryByText('PDF, DOCX')).toBeNull();
  });

  it('отдаёт выбранные файлы из нативного input', () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} />);

    const file = new File(['данные'], 'отчёт.pdf', { type: 'application/pdf' });
    pick(fileInput(), [file]);

    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('даёт input и зоне доступное имя', () => {
    const { unmount } = render(<FileUpload onFiles={() => {}} />);

    expect(screen.getAllByLabelText(DEFAULT_LABEL)).toContain(fileInput());

    unmount();
    render(<FileUpload label="Резюме" onFiles={() => {}} />);

    expect(screen.getAllByLabelText('Резюме')).toContain(fileInput());
  });

  it('открывает выбор файла по клику и клавиатуре', () => {
    render(<FileUpload onFiles={() => {}} />);
    const input = fileInput();
    const click = vi.spyOn(input, 'click').mockImplementation(() => {});
    const zone = screen.getByRole('button', { name: DEFAULT_LABEL });

    fireEvent.click(zone);
    expect(click).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(zone, { key: 'Enter' });
    expect(click).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(zone, { key: ' ' });
    expect(click).toHaveBeenCalledTimes(3);
  });

  it('прокидывает accept и multiple в input', () => {
    render(<FileUpload accept="image/*" multiple onFiles={() => {}} />);
    const input = fileInput();

    expect(input.getAttribute('accept')).toBe('image/*');
    expect(input.hasAttribute('multiple')).toBe(true);
  });

  it('берёт первый файл, когда multiple выключен', () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} />);

    const first = new File(['a'], 'a.txt');
    const second = new File(['b'], 'b.txt');
    drop(screen.getByRole('button', { name: DEFAULT_LABEL }), [first, second]);

    expect(onFiles).toHaveBeenCalledWith([first]);
  });

  it('помечает зону data-dragging и сбрасывает её при drop', () => {
    const onFiles = vi.fn();
    render(<FileUpload onFiles={onFiles} />);
    const zone = screen.getByRole('button', { name: DEFAULT_LABEL });
    const file = new File(['a'], 'a.txt');

    fireEvent.dragOver(zone, { dataTransfer: { files: [file] } });
    expect(zone.getAttribute('data-dragging')).toBe('true');

    drop(zone, [file]);
    expect(zone.hasAttribute('data-dragging')).toBe(false);
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('фильтрует файлы по maxSize и показывает ошибку', () => {
    const onFiles = vi.fn();
    render(<FileUpload maxSize={10} onFiles={onFiles} />);

    pick(fileInput(), [new File(['001234567890'], 'большой.txt')]);

    expect(onFiles).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain('большой.txt');
  });

  it('отдаёт подходящие файлы, когда часть превышает maxSize', () => {
    const onFiles = vi.fn();
    render(<FileUpload maxSize={10} multiple onFiles={onFiles} />);

    const small = new File(['ok'], 'маленький.txt');
    pick(fileInput(), [small, new File(['001234567890'], 'большой.txt')]);

    expect(onFiles).toHaveBeenCalledWith([small]);
    expect(screen.getByRole('alert').textContent).toContain('большой.txt');
  });

  it('игнорирует drop в disabled', () => {
    const onFiles = vi.fn();
    render(<FileUpload disabled onFiles={onFiles} />);
    const zone = screen.getByRole('button', { name: DEFAULT_LABEL });

    fireEvent.dragOver(zone, { dataTransfer: { files: [new File(['a'], 'a.txt')] } });
    drop(zone, [new File(['a'], 'a.txt')]);

    expect(zone.hasAttribute('data-dragging')).toBe(false);
    expect(onFiles).not.toHaveBeenCalled();
  });

  it('удаляет выбранный файл через onRemove', () => {
    const onRemove = vi.fn();
    const file = new File(['a'], 'a.txt');
    render(<FileUpload value={[file]} onFiles={() => {}} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: 'Удалить a.txt' }));

    expect(onRemove).toHaveBeenCalledWith(file);
  });
});
