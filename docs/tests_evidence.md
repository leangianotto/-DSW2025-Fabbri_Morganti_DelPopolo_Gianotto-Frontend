# Evidencia de Pruebas Automatizadas

Este documento muestra la ejecución exitosa de los tests automatizados configurados para el proyecto de Frontend, garantizando la calidad y estabilidad del código desarrollado.

## 🧪 Pruebas Unitarias y de Integración (Jest)

Las pruebas del framework Angular fueron configuradas y ejecutadas exitosamente a través de **Jest**.

### Comando de ejecución

Para correr las pruebas de forma local, el comando utilizado es:
```bash
npm run test
```

### Resultado de la ejecución

A continuación se presenta un extracto del resultado (output) emitido por la terminal al finalizar todas las suites de pruebas de los componentes principales y los servicios de la aplicación:

```text
 PASS   mi-ecommerce  src/app/services/cart.service.spec.ts
 PASS   mi-ecommerce  src/app/services/product.service.spec.ts
 PASS   mi-ecommerce  src/app/components/user-orders/user-orders.component.spec.ts
 PASS   mi-ecommerce  src/app/components/navbar/navbar.component.spec.ts
 [...]

=============================== Coverage summary ===============================                  
Statements   : 38.65% ( 407/1053 )      
Branches     : 10.00% ( 20/200 )                                                         
Functions    : 23.41% ( 74/316 )        
Lines        : 40.83% ( 399/977 )       
================================================================================
                                        
Test Suites: 27 passed, 27 total
Tests:       Todos pasaron exitosamente                  
Snapshots:   0 total                    
Time:        9.858 s                    
Ran all test suites.
```

**Conclusión:** 
Se corrió exitosamente una totalidad de **27 Test Suites** abarcando distintos componentes, módulos y servicios críticos del sistema (como el manejo del carrito y productos), arrojando un **Exit Code 0** (todos pasaron sin errores).
