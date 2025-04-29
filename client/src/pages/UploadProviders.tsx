import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Upload, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import useLanguage from '@/hooks/useLanguage';
import { queryClient } from '@/lib/queryClient';

export default function UploadProviders() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadReport, setUploadReport] = useState<any>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };
  
  // Validate file type and set it
  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: language === 'es' ? 'Formato de archivo no válido' : 'Invalid file format',
        description: language === 'es' 
          ? 'Por favor, selecciona un archivo Excel (.xlsx, .xls) o CSV.'
          : 'Please select an Excel (.xlsx, .xls) or CSV file.',
        variant: 'destructive',
      });
      return;
    }
    
    setFile(file);
    setUploadStatus('idle');
    setUploadMessage('');
    setUploadReport(null);
  };
  
  // Remove selected file
  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadMessage('');
    setUploadReport(null);
  };
  
  // Upload file to server
  const uploadFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/providers/import', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error uploading file');
      }
      
      // Handle successful upload
      setUploadStatus('success');
      setUploadMessage(
        language === 'es'
          ? `${result.imported || 0} proveedores importados correctamente.`
          : `Successfully imported ${result.imported || 0} providers.`
      );
      
      setUploadReport(result);
      
      // Invalidate providers cache
      queryClient.invalidateQueries({ queryKey: ['/api/providers'] });
      
      toast({
        title: language === 'es' ? 'Importación completada' : 'Import completed',
        description: language === 'es'
          ? `Se importaron ${result.imported || 0} proveedores correctamente.`
          : `Successfully imported ${result.imported || 0} providers.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      
      setUploadStatus('error');
      setUploadMessage(
        language === 'es'
          ? 'Hubo un problema al importar el archivo. Por favor, verifica el formato e inténtalo de nuevo.'
          : 'There was a problem importing the file. Please check the format and try again.'
      );
      
      toast({
        title: language === 'es' ? 'Error de importación' : 'Import error',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Download template
  const downloadTemplate = () => {
    // In a real app, this would download a template file
    // For this MVP, we'll just show a toast with instructions
    toast({
      title: language === 'es' ? 'Plantilla de Excel' : 'Excel Template',
      description: language === 'es'
        ? 'La plantilla debe contener columnas para: Nombre de Empresa, RFC, Tipo de Proveedor, Términos de Pago, etc.'
        : 'The template should contain columns for: Company Name, RFC, Provider Type, Payment Terms, etc.',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showBackButton backUrl="/provider-database" />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'es' ? 'Importar Proveedores' : 'Import Providers'}
          </h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {language === 'es' ? 'Instrucciones' : 'Instructions'}
              </CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Sube un archivo Excel (.xlsx, .xls) o CSV con los datos de los proveedores.'
                  : 'Upload an Excel (.xlsx, .xls) or CSV file with provider data.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    {language === 'es'
                      ? 'Descarga nuestra plantilla para formato correcto'
                      : 'Download our template for correct formatting'}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  {language === 'es' ? 'Descargar Plantilla' : 'Download Template'}
                </Button>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-6 text-center"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{ 
                  borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                  backgroundColor: isDragging ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                }}
              >
                {!file ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'es'
                          ? 'Arrastra y suelta tu archivo aquí, o'
                          : 'Drag and drop your file here, or'}
                      </p>
                      <label className="inline-block mt-2">
                        <span className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium cursor-pointer">
                          {language === 'es' ? 'Seleccionar Archivo' : 'Select File'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls,.csv"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <Button 
                      onClick={uploadFile} 
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading
                        ? (language === 'es' ? 'Importando...' : 'Importing...')
                        : (language === 'es' ? 'Importar Proveedores' : 'Import Providers')}
                    </Button>
                  </div>
                )}
              </div>
              
              {uploadStatus !== 'idle' && (
                <Alert variant={uploadStatus === 'success' ? 'default' : 'destructive'}>
                  {uploadStatus === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {uploadStatus === 'success'
                      ? (language === 'es' ? 'Importación exitosa' : 'Import successful')
                      : (language === 'es' ? 'Error' : 'Error')}
                  </AlertTitle>
                  <AlertDescription>{uploadMessage}</AlertDescription>
                </Alert>
              )}
              
              {uploadReport && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-medium mb-2">
                    {language === 'es' ? 'Resumen de importación' : 'Import Summary'}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      {language === 'es' ? 'Registros procesados:' : 'Records processed:'} {uploadReport.total || 0}
                    </li>
                    <li>
                      {language === 'es' ? 'Importados correctamente:' : 'Successfully imported:'} {uploadReport.imported || 0}
                    </li>
                    <li>
                      {language === 'es' ? 'Errores:' : 'Errors:'} {uploadReport.errors || 0}
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setLocation('/provider-database')}
            >
              {language === 'es' ? 'Volver a la Lista de Proveedores' : 'Back to Provider List'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}